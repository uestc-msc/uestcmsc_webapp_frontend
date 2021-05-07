import {createUploadSession} from "@/api/cloud";
import axios from "@/utils/axios";
import {firstDelay, sleep, totalRetryTimes} from "@/utils/index";
import {humanReadableFileSize} from "vuetify/lib/util/helpers";
import moment from "@/utils/moment";
import {Status} from "@/utils/status";

// 文件分块大小为 50 MiB
// 参考文档：https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession?view=graph-rest-1.0#best-practices
export const maxFileContentLength = 50 * (1 << 20);


// 表示文件上传状态的类
export class FileStatus {
  constructor(file = null, info = null) {
    // info 和 file 二者有其一就可以互补
    this.file = file ? file : new File([], info.filename);
    this.info = info ? info : {filename: file.name, size: file.size};

    this.status = Status.default; // 文件状态
    this.progress = 100;            // 上传进度的百分比（100 为完成）
    this.msg = '';                // 成功/错误信息
    this.key = Math.random()      // 随机生成的 id
  }

  get showProgressLine() {
    return [Status.submitting, Status.uploading, Status.success, Status.error].includes(this.status);
  }
}


// 将单位为字节的数字格式化为 x.xx MiB 格式的字符串
export function formatBytes(bytes) {
  return humanReadableFileSize(bytes, true);
}


/**
 * 将 v-file-uploader 的输入格式化为 Array
 * @param input v-file-uploader 的返回值，可能为 null, [], File, File[]
 */
export function formatFileUploaderInput(input) {
  if (input === null)             // 如果 input 是 null
    return [];
  if (!(input instanceof Array))  // 如果 input 是 File
    return [input];
  return input;                   // 如果 input 是 Array
}


export function formatUrl(url) {
  return url.includes('://') ? url : 'https://' + url;
}

/**
 * 调用后端接口，将文件上传至 onedrive。
 * 参考文档：https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession
 * @param file 要上传的文件（File 类）
 * @param setProgressFunction 设置上传进度的函数（该函数应接收参数 v，表示当前上传进度为 v%），为 null 表示不调用
 * @param setStatusFunction 设置上传进度未知的函数（该函数应接收参数 v，v=True 表示当前上传进度未知），为 null 表示不调用
 * @param setMsgFunction 设置上传进度提示语（该函数应接收参数 v），为 null 表示不调用
 */
export async function uploadFile(
  file,
  setProgressFunction = null,
  setStatusFunction = null,
  setMsgFunction = null
) {
  // TODO: 如何停止上传
  // 非 null 时调用
  let setStatus = (value) => setStatusFunction && setStatusFunction(value);
  let setProgress = (value) => setProgressFunction && setProgressFunction(value);
  let setMsg = (value) => setMsgFunction && setMsgFunction(value);

  // 创建上传会话
  setStatus(Status.submitting);
  setProgress(0);
  setMsg('创建上传会话')
  let res = await createUploadSession({"filename": file.name});
  const uploadUrl = JSON.parse(res.data).uploadUrl;
  setStatus(Status.uploading);
  setMsg('上传文件')
  const size = file.size;
  let startTimeStamp = null;

  // 上传由 start-end 指定的 file part
  // MS 直接给了上传时错误处理的策略，nb！
  // https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession#best-practices
  async function uploadPart(start, end, retryTimes = 0, nextDelay = firstDelay) {
    // console.log(`uploadPart: start=${start}, end=${end}, retryTimes=${retryTimes}, nextDelay=${nextDelay}`);
    function onUploadProgress(event) {
      let uploadedBytes = event.loaded + start;
      setProgress(uploadedBytes / size * 100);
      if (startTimeStamp) {
        if (startTimeStamp + 10000 > event.timeStamp)           // 刚开始的信息误差非常大，因此 10s 以后才显示预计时间
          return;
        let uploadBytesStr = formatBytes(uploadedBytes);
        let time = (event.timeStamp - startTimeStamp) / 1000;   // 单位：s
        let speed = uploadedBytes / time;                       // 单位：B/s
        let speedStr = formatBytes(speed) + '/s'
        let evaluateRemain = (size - uploadedBytes) / speed;   // 单位：s
        let evaluateRemainStr = moment.utc(evaluateRemain * 1000).format('HH:mm:ss');
        setMsg(`上传文件，已上传 ${uploadBytesStr}，平均速度 ${speedStr}，预计剩余时间 ${evaluateRemainStr}`)
      } else {
        startTimeStamp = event.timeStamp;
      }
    }

    let headers = {};
    let status = 0;
    headers['Content-Range'] = `bytes ${start}-${end - 1}/${size}`;
    headers['Content-Type'] = file.type;
    let config = {
      withCredentials: false,
      timeout: 0,
      headers,
      onUploadProgress
    };
    try {
      res = await axios.put(uploadUrl, file.slice(start, end), config);
      status = res.status;
    } catch (err) {
      status = 500;
    }

    if (status >= 500) {        // 继续或重试由于连接中断或任意 5xx 错误而失败的上载，请使用指数退避战略
      setMsg(`上传失败，等待 ${nextDelay / 1000}s 后上传...`);
      await sleep(nextDelay);
      return await uploadPart(start, end, retryTimes, nextDelay * 2);
    } else if (status >= 200 && status < 300) {   // 成功上传该段，返回
      return res;
    } else {                    // 对于其他错误，不应使用指数退避战略，而应限制尝试重试的次数
      if (retryTimes > 0) {
        if (retryTimes > totalRetryTimes) {
          setMsg(`上传失败 ${retryTimes} 次，取消上传`);
          throw res;
        } else {
          setMsg(`上传失败 ${retryTimes} 次，重试中...`);
          return await uploadPart(start, end, retryTimes + 1, nextDelay);
        }
      }
    }
  }

  let status = 0;
  let start, end = 0;
  // 200 为上传成功（覆盖），201 为上传成功（新建）
  while (status !== 200 && status !== 201) {
    start = end;
    end = Math.min(start + maxFileContentLength, file.size);
    res = await uploadPart(start, end);
    status = res.status;
  }
  setProgress(100);
  return res;
}


// 自动下载 url 对应的文件
export function downloadFile(url) {
  // 其实设定 <a :href="url" target="_blank"> 就可以了
  window.open(url);
  // let a = document.createElement('A');
  // a.href = url;
  // a.download = url.substr(url.lastIndexOf('/') + 1);
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
}

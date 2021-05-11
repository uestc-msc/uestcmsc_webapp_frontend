import {createUploadSession, getOnedriveFileUrl} from "@/api/cloud";
import axios from 'axios';
import {displayErrorTime, displaySuccessTime, firstDelay, sleep, totalRetryTimes} from "@/utils/index";
import {humanReadableFileSize} from "vuetify/lib/util/helpers";
import moment from "@/utils/moment";
import {Status} from "@/utils/status";

/**
 * 文件分块大小，50 MiB
 * 参考文档：https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession?view=graph-rest-1.0#best-practices
 * @type {number}
 */
export const maxFileContentLength = 50 * (1 << 20);

/**
 * 表示文件上传状态的类
 */
export class FileStatus {
  constructor(file = null, info = null) {
    // info 和 file 二者有其一就可以互补
    this.file = file ? file : new File([], info.filename);
    this.info = info ? info : {filename: file.name, size: file.size};

    this.status = Status.default;   // 文件状态
    this.progress = 100;            // 上传进度的百分比（100 为完成）
    this.msg = '';                  // 成功/错误信息
    this.key = Math.random()        // 随机生成的 id
    if (file)                       // 上传文件的 CancelToken
      this.axiosSource = axios.CancelToken.source();
    // 其实 axiosSource.token 也可以作为 id 但是懒得改了
  }

  get showProgressLine() {
    return [Status.submitting, Status.uploading, Status.success, Status.error].includes(this.status);
  }
}


/**
 * 将文件转为 base64，可用于将图片文件显示在页面上
 * @param file {File}
 * @return {Promise<String>}
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


/**
 * 将单位为字节的数字格式化为 x.xx MiB 格式的字符串
 * @param bytes {Number}
 * @return {String}
 */
export function formatBytes(bytes) {
  return humanReadableFileSize(bytes, true);
}


/**
 * 将 v-file-uploader 的输入格式化为 Array
 * @param input {null, File, File[]} v-file-uploader 的返回值
 * @return {File[]}
 */
export function formatFileUploaderInput(input) {
  if (input)                      // 如果 input 是 null
    return [];
  if (!(input instanceof Array))  // 如果 input 是 File
    return [input];
  return input;                   // 如果 input 是 Array
}


/**
 * 将链接改写为浏览器能够直接打开的链接（添加 https:// 前缀）
 * @param url {string}
 * @return {string}
 */
export function formatUrl(url) {
  return url.includes('://') ? url : 'https://' + url;
}


/**
 * 调用后端接口，将文件上传至 onedrive，并调用 API 上传到对应位置。
 * 参考文档：https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession
 * @param fileStatus {FileStatus}
 * @param statusArray {FileStatus[]} 当前页面的 fileStatus 类。上传错误后会从该数组删除 fileStatus
 * @param apiFunction {Function} 文件上传完成后调用 API 的函数。该函数接受一个参数即 onedrive 上传成功的响应；且应当返回上传成功的响应
 * @return response apiFunction 的响应报文
 */
export async function uploadFileToOnedrive(fileStatus, statusArray, apiFunction) {
  try {
    // 创建上传会话
    fileStatus.status = Status.submitting;
    fileStatus.progress = 0;
    fileStatus.msg = '创建上传会话';
    let res0, res1, res2;
    res0 = await createUploadSession({"filename": fileStatus.file.name});
    const uploadUrl = JSON.parse(res0.data).uploadUrl;
    fileStatus.status = Status.uploading;
    fileStatus.msg = '上传文件';
    const size = fileStatus.file.size;
    let startTimeStamp = null;

    // 上传由从 start 至 end 字节的 file part
    // MS 直接给了上传时错误处理的策略，nb！
    // https://docs.microsoft.com/zh-cn/graph/api/driveitem-createuploadsession#best-practices
    async function uploadPart(start, end, retryTimes = 0, nextDelay = firstDelay) {
      // 定义上传时的进度条功能
      function onUploadProgress(event) {
        let uploadedBytes = event.loaded + start;
        fileStatus.progress = uploadedBytes / size * 100;
        if (startTimeStamp === null) {
          startTimeStamp = event.timeStamp;
        } else {
          let uploadBytesStr = formatBytes(uploadedBytes);        // 已经上传的字节数
          let time = (event.timeStamp - startTimeStamp) / 1000;   // 已经使用的时间，单位：s
          let speed = uploadedBytes / time;                       // 目前的上传速度，单位：B/s
          let speedStr = formatBytes(speed) + '/s'
          let remainPart = Math.ceil((size - start) / maxFileContentLength);  // 还剩的分段，预计每个分段额外需要 5s 的确认时间
          let evaluateRemain = (size - uploadedBytes) / speed + remainPart * 5;    // 预计剩余时间，单位：s
          let evaluateRemainStr = evaluateRemain > 86400000
            ? '大于一天'
            : moment.utc(evaluateRemain * 1000).format('HH:mm:ss');
          fileStatus.msg = `上传文件，已上传 ${uploadBytesStr}，平均速度 ${speedStr}，预计剩余时间 ${evaluateRemainStr}`;
        }
      }

      let headers = {};
      let status = 0;
      headers['Content-Range'] = `bytes ${start}-${end - 1}/${size}`;
      headers['Content-Type'] = fileStatus.file.type;
      let config = {
        withCredentials: false,
        timeout: 0,
        headers,
        onUploadProgress,
        cancelToken: fileStatus.axiosSource.token
      };
      // 开始上传
      try {
        res1 = await axios.put(uploadUrl, fileStatus.file.slice(start, end), config);
        status = res1.status;
      } catch (err) {
        if (axios.isCancel(err))
          throw {"data": "上传被取消"};
        status = 500;
      }
      // 上传时错误处理
      if (status >= 500) { // 继续或重试由于连接中断或任意 5xx 错误而失败的上载，请使用指数退避战略
        fileStatus.msg = `上传失败，等待 ${nextDelay / 1000}s 后上传...`;
        await sleep(nextDelay);
        return await uploadPart(start, end, retryTimes, nextDelay * 2);
      } else if (status >= 200 && status < 300) {   // 成功上传该段，返回
        return res1;
      } else { // 对于其他错误，不应使用指数退避战略，而应限制尝试重试的次数
        if (retryTimes > 0) {
          if (retryTimes > totalRetryTimes) {
            fileStatus.msg = `上传失败 ${retryTimes} 次，取消上传`;
            throw res1;
          } else {
            fileStatus.msg = `上传失败 ${retryTimes} 次，重试中...`;
            return await uploadPart(start, end, retryTimes + 1, nextDelay);
          }
        }
      }
    }

    // 真正开始分段上传
    let status = 0;
    let start, end = 0;
    while (status !== 200 && status !== 201) {
      // 200 为上传成功（覆盖），201 为上传成功（新建）
      start = end;
      end = Math.min(start + maxFileContentLength, fileStatus.file.size);
      res1 = await uploadPart(start, end);
      status = res1.status;
    }
    fileStatus.progress = 100;
    fileStatus.status = Status.submitting;
    fileStatus.msg = '写入数据库';
    // 上传成功，写入数据库
    // 如果上传成功但是写入数据库失败，还是做一下重试操作
    for (let i = 1; i <= totalRetryTimes; i++) {
      try {
        res2 = await apiFunction(res1);
        break;
      } catch (res2) {
        if (i === totalRetryTimes)
          throw res2;
      }
    }
    fileStatus.msg = '上传成功';
    fileStatus.status = Status.success;
    fileStatus.info = res2.data;
    await sleep(displaySuccessTime);
    fileStatus.msg = '';
    fileStatus.status = Status.default;
    return res2;
  } catch (res) {
    // 如果过程中抛出任何错误，就向用户提示错误并结束上传
    fileStatus.msg = res.data;
    fileStatus.status = Status.error;
    await sleep(displayErrorTime);
    let index = statusArray.indexOf(fileStatus);
    console.assert(index >= 0);
    statusArray.splice(index, 1);
    throw res;
  }
}


/**
 * 取消上传
 * @param fileStatus {FileStatus}
 */
export function cancelUploadFileToOnedrive(fileStatus) {
  fileStatus.axiosSource.cancel('您取消了上传');
}


/**
 * 删除 Onedrive 文件
 * @param fileStatus 包含文件内容、文件状态、文件信息，见 FileStatus 类
 * @param statusArray 当前页面的 fileStatus 类。上传错误后会从该数组删除 fileStatus
 * @param apiFunction 文件上传完成后调用 API 的函数。该函数接受一个参数即 onedrive 上传成功的响应；且应当返回上传成功的响应
 * @return response 删除操作的响应报文
 */
export async function deleteFileFromOnedrive(fileStatus, statusArray, apiFunction) {
  let that = this;
  fileStatus.status = Status.submitting;
  fileStatus.msg = '删除中';
  try {
    let response = await apiFunction();
    fileStatus.status = Status.success;
    fileStatus.msg = '删除成功';
    await sleep(displaySuccessTime);
    let index = statusArray.indexOf(fileStatus);
    console.assert(index >= 0);
    statusArray.splice(index, 1);
    return response;
  } catch (response) {
    fileStatus.status = Status.error;
    fileStatus.msg = response.data;
    await sleep(displayErrorTime);
    fileStatus.status = Status.default;
    fileStatus.msg = '';
    return response;
  }
}


/**
 * 自动下载 url 对应的文件
 * @param url {String}
 */
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

/**
 * 自动下载 Onedrive 中 id 对应的文件
 * @param id {String}
 */
export function downloadOnedriveFile(id) {
  window.open(getOnedriveFileUrl(id));
}
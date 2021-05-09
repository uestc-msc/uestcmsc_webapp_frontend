<template>
    <v-container>
      <!-- 三行 n 列  -->
      <v-row
        v-for="r in range(0, photoStatus.length, photosPerRow)"
        :key="r"
      >
        <v-col
          v-for="i in range(r, r+photosPerRow)"
          :key="i"
          :cols="12 / photosPerRow"
        >
          <v-img
            v-if="i < photoStatus.length"
            :src="url(photoStatus[i])"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <PicturePlaceholderAlt aspect-ratio="1"/>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import {Status, StatusColor} from "@/utils/status";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import range from 'lodash/range'
import {getOnedriveFileUrl} from "@/api/cloud";
import {FileStatus, formatFileUploaderInput, uploadFileToOnedrive} from "@/utils/file";
import {displayErrorTime, displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile} from "@/api/activity";

export default {
  components: {PicturePlaceholderAlt},
  props: {
    activityId: {
      type: [String, Number],
      required: true
    },
    fileInputValue: {
      type: [Array, File],
      default: () => []
    },
    photosPerRow: {
      type: [String, Number],
      default: 3
    }
  },

  data() {
    return {
      localPhotoStatus: [],       // 本地正在上传的照片
      cloudPhotoStatus: [],       // 已经在云端的照片

      page: 1,                    // 本地正在上传的照片
      pageSize: 9,                // 一页的大小
      count: 9,                   // 云端提供的总长度

      Status,
      StatusColor,
      range,
    }
  },

  computed: {
    photoStatus() {
      return [...this.localPhotoStatus, ...this.cloudPhotoStatus]
    },
    url(fileStatus) {
      if (fileStatus.info)
        return getOnedriveFileUrl(fileStatus.info.id);
      else
        return fileStatus.file;
    },
  },

  methods: {
    // 从后端获取当前 page 的 data
    fetchData() {
      this.page
    },

    uploadFile(files) {
      let that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 fileStatus 里并丢进 fileStatusArray
        let fileStatus = new FileStatus(file, null);
        that.fileStatusArray.push(fileStatus);

        const setProgress = (p) => fileStatus.progress = p;
        const setIndeterminate = (s) => fileStatus.status = s;
        const setMsg = (m) => fileStatus.msg = m;

        fileStatus.status = Status.uploading;
        uploadFileToOnedrive(file, setProgress, setIndeterminate, setMsg)
          .then(async (res) => {
            fileStatus.status = Status.submitting;
            fileStatus.msg = '写入数据库';
            const file_id = res.data.id;
            const data = {
              file_id,
              activity_id: that.activity.id
            };
            // 如果上传成功但是写入数据库失败，还是做一下重试操作
            let res2;
            for (let i = 1; i <= totalRetryTimes; i++) {
              try {
                res2 = await addActivityFile(data);
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
            this.updateData();
          })
          .catch(async res => {
            fileStatus.msg = res.data;
            fileStatus.status = Status.error;
            await sleep(displayErrorTime);
            let index = that.fileStatusArray.indexOf(fileStatus);
            console.assert(index >= 0);
            that.fileStatusArray.splice(index, 1);
          });
      }));
    },
  },

  watch: {
    // 本地请求上传新的照片
    fileInputValue() {
      if (this.fileInputValue) {
        this.uploadFile(this.fileInputValue);
        this.$emit('update:fileInputValue', []);
      }
    }
  },
}
</script>
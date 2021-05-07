<template>

<!--  隐藏了的文件上传栏，靠 toggleUploadPhoto 触发  -->
<v-file-input
  multiple
  accept="image/*"
  @change="uploadNewPhoto"

  id="photoInput"
  style="display: none"
/>

</template>

<script>
import {FileStatus, formatFileUploaderInput, uploadFile} from "@/utils/file";
import {Status} from "@/utils/status";
import {displayErrorTime, displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile} from "@/api/activity";

export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toggleUploadPhoto: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    uploadNewPhoto(files) {
      let that = this;
      window.that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 fileStatus 里并丢进 fileStatusArray
        let fileStatus = new FileStatus(file, null);
        that.fileStatusArray.push(fileStatus);

        const setProgress = (p) => fileStatus.progress = p;
        const setIndeterminate = (s) => fileStatus.status = s;
        const setMsg = (m) => fileStatus.msg = m;

        fileStatus.status = Status.uploading;
        uploadFile(file, setProgress, setIndeterminate, setMsg)
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
            if (index !== -1)
              that.fileStatusArray.splice(index, 1);
          });
      }));
      that.fileInputValue = [];
    },


    cancelUpload(fileStatus) {
      // Todo: cancel upload
    },

    fetchData() {   // 根据 activity 更新 linkArray
      this.linkArray = this.activity.link.map(info => new Link(info));
    },

    updateData() {   // 根据 linkArray 更新 activity
      let new_activity = {...this.activity};
      new_activity.link = this.linkArray.map(status => status.info);
      this.$emit('update', new_activity);
    }
  },

  watch: {
    activity() {
      this.fetchData();
    },

    toggleUploadPhoto() {
      const photoInput = document.getElementById('photoInput');
      photoInput.click();
    }
  },

  created() {
    this.fetchData();
  },
}
</script>
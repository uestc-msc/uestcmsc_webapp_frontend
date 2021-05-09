<template>
  <div>
    <ActivityGallery
      :activity-id="activity.id"
      v-model="photoStatusArray"
    />
    <!--  隐藏了的文件上传栏，靠 toggleUploadPhoto 触发  -->
    <v-file-input
      multiple
      accept="image/*"
      @change="uploadNewPhoto"
      id="photoInput"
      style="display: none"
    />
  </div>
</template>

<script>
import {FileStatus, formatFileUploaderInput, uploadFileToOnedrive} from "@/utils/file";
import {Status, StatusColor} from "@/utils/status";
import {displayErrorTime, displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile, addActivityPhoto} from "@/api/activity";
import ActivityGallery from "@/components/ui/photo/activity-gallery";

export default {
  components: {ActivityGallery},
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

  data() {
    return {
      photoStatusArray: [],
      fileInputValue: [],

      Status,
      StatusColor,
    }
  },

  methods: {
    uploadNewPhoto(files) {
      let that = this;
      const formattedFiles = formatFileUploaderInput(files);

      Promise.all(formattedFiles.map(async (file) => {
        // 将文件状态存到 photoStatus 里并丢进 photoStatusArray
        let photoStatus = new FileStatus(file, null);
        that.photoStatusArray.push(photoStatus);

        const setProgress = (p) => photoStatus.progress = p;
        const setIndeterminate = (s) => photoStatus.status = s;
        const setMsg = (m) => photoStatus.msg = m;

        photoStatus.status = Status.uploading;
        uploadFileToOnedrive(file, setProgress, setIndeterminate, setMsg)
          .then(async (res) => {
            photoStatus.status = Status.submitting;
            photoStatus.msg = '写入数据库';
            const file_id = res.data.id;
            const data = {
              file_id,
              activity_id: that.activity.id
            };
            // 如果上传成功但是写入数据库失败，还是做一下重试操作
            let res2;
            for (let i = 1; i <= totalRetryTimes; i++) {
              try {
                res2 = await addActivityPhoto(data);
                break;
              } catch (res2) {
                if (i === totalRetryTimes)
                  throw res2;
              }
            }
            photoStatus.msg = '上传成功';
            photoStatus.status = Status.success;
            photoStatus.info = res2.data;
            await sleep(displaySuccessTime);
            photoStatus.msg = '';
            photoStatus.status = Status.default;
            this.updateData();
          })
          .catch(async res => {
            photoStatus.msg = res.data;
            photoStatus.status = Status.error;
            await sleep(displayErrorTime);
            let index = that.photoStatusArray.indexOf(photoStatus);
            if (index !== -1)
              that.photoStatusArray.splice(index, 1);
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
      this.$emit('update:activity', new_activity);
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
<template>
  <v-container v-if="value">
    <v-row>
      <!--  正在上传的图片  -->
      <v-col v-for="photo in localPhoto" :key="photo.key" :cols="cols">

          <v-img
            :src="photo.info.data"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <v-overlay absolute opacity="0.8">
              <v-row justify="center">
              <v-progress-circular
                absolute
                size="64"
                width="8"
                :value="photo.status === Status.uploading ? photo.progress : 100"
                :indeterminate="photo.status === Status.submitting"
                :color="StatusColor[photo.status]"
              />
              </v-row>
              <v-row>
                {{photo.msg}}
              </v-row>
            </v-overlay>
          </v-img>
      </v-col>

      <!--  已经在云端的图片  -->
      <v-col v-for="photo in cloudPhoto" :key="photo.id" :cols="cols">
        <v-img
          :src="getOnedriveFileUrl(photo.id)"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <template v-slot:placeholder>
            <PicturePlaceholderAlt aspect-ratio="1"/>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <ErrorAlert
      v-if="errorMsg"
      as-row
      :msg="errorMsg"
    />

    <v-row>
      <v-col>
        <v-btn
          v-if="cloudCount !== cloudPhoto.length"
          :loading="loading"
          :color="this.errorMsg ? 'error' : 'primary'"
          block
          @click="fetchData"
        >
          加载更多
        </v-btn>
      </v-col>
    </v-row>

    <!--  隐藏的文件上传栏，靠 toggleUploadPhoto 触发  -->
    <v-file-input
      v-model="fileInputValue"
      @change="uploadFile"
      multiple
      accept="image/*"
      id="photoInput"
      style="display: none"
    />
  </v-container>
</template>

<script>
// todo 预览图
// todo top photo
import {Status, StatusColor} from "@/utils/status";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import range from 'lodash/range'
import {getOnedriveFileUrl} from "@/api/cloud";
import {FileStatus, fileToBase64, uploadFileToOnedrive} from "@/utils/file";
import {addActivityPhoto, getActivityPhotoList} from "@/api/activity";
import ErrorAlert from "@/components/ui/base/error-alert";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

// 一页的大小
const pageSize = 9;

export default {
  components: {PicturePlaceholder, ErrorAlert, PicturePlaceholderAlt},
  props: {
    activityId: {
      required: true
    },
    // 如果不存在图片，将设置 value 为 false，父组件可以隐藏整个区域
    value: {
      type: Boolean,
      default: true
    },
    // 用户想要上传照片时，切换 toggleUploadPhoto 值即可
    toggleUploadPhoto: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: [String, Number],
      default: 4
    }
  },

  data() {
    return {
      fileToBase64,
      // 本地正在上传的照片，元素为 fileStatus
      localPhoto: [],
      // 已经在云端的照片，元素为后端给的 ActivityPhoto 信息
      cloudPhoto: [],
      // 云端提供的总长度，本地上传/删除照片时记得修改
      cloudCount: 0,

      fileInputValue: [],
      loading: false,
      errorMsg: '',

      Status,
      StatusColor,
      range,
      getOnedriveFileUrl
    }
  },

  methods: {
    uploadFile(files) {
      let that = this;
      let apiFunction = (response) => addActivityPhoto({
        file_id: response.data.id,
        activity_id: that.activityId
      });
      for (let file of files) {
        // 将文件状态存到 fileStatus 里并丢进 fileStatusArray
        let fileStatus = new FileStatus(file, null);
        that.localPhoto.push(fileStatus);
        // 将文件转为 base64 然后显示在屏幕上
        fileToBase64(file).then(data => that.$set(fileStatus.info, 'data', data));
        uploadFileToOnedrive(fileStatus, that.localPhoto, apiFunction)
          .then(res => {
            // 将已经上传完的从 localPhoto 移动到 cloudPhoto
            const index = this.localPhoto.indexOf(fileStatus);
            console.assert(index >= 0);
            that.localPhoto.splice(index, 1);
            that.cloudPhoto.unshift(res.data);
            that.cloudCount++;
          })
          .catch(() => {});
      }
    },

    // 从后端获取下一 page 的 data
    fetchData() {
      // 获取不超过 pageSize 数量的照片，使得 cloudPhoto 为 pageSize 的倍数
      const curPage = Math.floor(this.cloudPhoto.length / pageSize);
      let that = this;
      this.loading = true;
      this.errorMsg = '';
      getActivityPhotoList(this.activityId, curPage + 1, pageSize)
        .then(res => {
          that.count = res.data.count;
          if (that.count === 0)
            this.$emit('input', false);
          const result = res.data.results;
          that.cloudPhoto.splice(curPage * pageSize);
          that.cloudPhoto.push(...result);
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
          this.errorMsg = res.data;
        })
    },
  },

  watch: {
    activityId() {
      if (this.activityId) {
        this.cloudPhoto = [];
        this.fetchData();
      }
    },

    // 本地请求上传新的照片，弹出选择窗口
    toggleUploadPhoto() {
      const photoInput = document.getElementById('photoInput');
      photoInput.click();
    },
  },
  created() {
    window.gallery = this;
    this.fetchData();
  },

  activated() {
    console.log('activated', this.activityId);
  }
}
</script>
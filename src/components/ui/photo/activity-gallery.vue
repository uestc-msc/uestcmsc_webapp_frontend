<template>
  <v-container v-if="value">
    <v-row>
      <!--  正在上传的图片  -->
      <v-col v-for="photo in localPhoto" :key="photo.key" :cols="cols">
          <v-img
            v-ripple
            :src="photo.info.data"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <v-overlay absolute opacity="0.8">
              <v-row align="center" justify="center">
              <v-progress-circular
                absolute
                :size="progressCircularSize"
                :width="progressCircularSize / 8"
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
      <v-col v-for="(photo, i) in cloudPhoto" :key="photo.id" :cols="cols">
        <v-img
          v-ripple
          @click.stop="index=i"
          :src="getOnedriveFileUrl(photo.id)"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <v-icon
            v-if="activity && photo.id === activity.banner_id"
            class="rotate45 icon-on-image"
          >mdi-pin</v-icon>
          <template v-slot:placeholder>
            <PicturePlaceholderAlt aspect-ratio="1"/>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <ActivityGalleryCarousel
      :photos.sync="cloudPhoto"
      :count="cloudCount"
      :index.sync="index"
      :activity.sync="activity"
      @update:activity="$emit('update:banner-id', activity.banner_id)"
      @fetchNextPageData="fetchData"
    />

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
import {Status, StatusColor} from "@/utils/status";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import range from 'lodash/range'
import {getOnedriveFileUrl} from "@/api/cloud";
import {FileStatus, fileToBase64, uploadFileToOnedrive} from "@/utils/file";
import {addActivityPhoto, getActivityDetail, getActivityPhotoList} from "@/api/activity";
import ErrorAlert from "@/components/ui/base/error-alert";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import ActivityGalleryCarousel from "@/components/ui/photo/activity-gallery-carousel";

// 一页的大小
const pageSize = 9;

export default {
  components: {ActivityGalleryCarousel, PicturePlaceholder, ErrorAlert, PicturePlaceholderAlt},
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
    // 该值只用于触发父组件的 update:banner-id 事件
    bannerId: {
      default: null
    },
    cols: {
      type: [String, Number],
      default: 4
    }
  },

  data() {
    return {
      // 本地正在上传的照片，元素为 fileStatus
      localPhoto: [],
      // 已经在云端的照片，元素为后端给的 ActivityPhoto 信息
      cloudPhoto: [],
      // 云端提供的总长度，本地上传/删除照片时记得修改
      cloudCount: 0,
      // 活动信息
      activity: null,

      fileInputValue: [],
      loading: false,
      errorMsg: '',

      // 轮播图的图片下标，-1 表示不显示轮播图
      index: -1,

      Status,
      StatusColor,
      range,
      getOnedriveFileUrl,
    }
  },

  computed: {
    progressCircularSize() {
      return this.$vuetify.breakpoint.xs ? 32 : 64;
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

    fetchActivity() {
      if (this.activityId) {
        this.cloudPhoto = [];
        this.fetchData();
        let that = this;
        getActivityDetail(this.activityId)
          .then(res => that.activity = res.data)
          .catch(res => that.errorMsg = res.data);
      }
    },
    // 从后端获取下一 page 的 data
    fetchData() {
      // 如果已经加载完所有照片了，就不 fetch 了
      if (this.cloudCount === this.cloudPhoto.length && this.cloudCount !== 0)
        return;
      // 获取不超过 pageSize 数量的照片，使得 cloudPhoto 为 pageSize 的倍数
      const curPage = Math.floor(this.cloudPhoto.length / pageSize);
      let that = this;
      this.loading = true;
      this.errorMsg = '';
      getActivityPhotoList(this.activityId, curPage + 1, pageSize)
        .then(res => {
          that.cloudCount = res.data.count;
          if (that.cloudCount === 0)
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
      this.fetchActivity();
    },

    // 本地请求上传新的照片，弹出选择窗口
    toggleUploadPhoto() {
      const photoInput = document.getElementById('photoInput');
      photoInput.click();
    },
  },

  created() {
    this.fetchData();
    this.fetchActivity();
  },
}
</script>
<template>
    <v-container v-if="value">
      <!-- 三行 n 列  -->
      <v-row
        v-for="r in range(0, photo.length, photosPerRow)"
        :key="r"
      >
        <v-col
          v-for="i in range(r, r+photosPerRow)"
          :key="i"
          :cols="12 / photosPerRow"
        >
          <!--  正在上传的图片  -->
          <v-img
            v-if="i < localPhoto.length"
            :src="photo[i].info.data"
            aspect-ratio="1"
            class="grey lighten-2"
          >
          </v-img>

          <!--  已经在云端的图片  -->
          <v-img
            v-else-if="i < photo.length"
            :src="getOnedriveFileUrl(photo[i].id)"
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
            v-if="count !== cloudPhoto.length"
            :loading="loading"
            :color="this.errorMsg ? 'error' : 'primary'"
            block
            @click="fetchData"
          >
            加载更多
          </v-btn>
        </v-col>
      </v-row>

    </v-container>
</template>

<script>
import {Status, StatusColor} from "@/utils/status";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import range from 'lodash/range'
import {getOnedriveFileUrl} from "@/api/cloud";
import {FileStatus, fileToBase64, uploadFileToOnedrive} from "@/utils/file";
import {addActivityPhoto, getActivityPhotoList} from "@/api/activity";
import ErrorAlert from "@/components/ui/base/error-alert";

// 一页的大小
const pageSize = 9;

export default {
  components: {ErrorAlert, PicturePlaceholderAlt},
  props: {
    activityId: {
      type: [String, Number],
      required: true
    },
    // 如果不存在图片，将设置 value 为 false，父组件可以隐藏整个区域
    value: {
      type: Boolean,
      default: true
    },
    // 如果需要上传图片，将从 v-file-input 中的数据装进该数组即可
    fileInputValue: {
      type: [Array, File],
      default: () => []
    },
    // 每行的照片数
    photosPerRow: {
      type: [String, Number],
      default: 3
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
      count: 0,

      loading: false,
      errorMsg: '',

      Status,
      StatusColor,
      range,
      getOnedriveFileUrl
    }
  },

  computed: {
    // 本地照片和云端照片的拼接数组，用于布局
    photo() {
      return [...this.localPhoto, ...this.cloudPhoto];
    },
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
    // 'activity.id'() {
    //   this.fetchData();
    // },

    // 本地请求上传新的照片
    fileInputValue() {
      if (this.fileInputValue) {
        this.uploadFile(this.fileInputValue);
        this.$emit('update:fileInputValue', []);
      }
    },
  },
  created() {
    window.gallery = this;
    this.fetchData();
  }
}
</script>
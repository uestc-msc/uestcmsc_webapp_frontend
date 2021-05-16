<template>
  <v-dialog
    v-model="show"
    :fullscreen="mobile"
    :width="photoWidth"
    persistent
    no-click-animation
    @click:outside="show = mobile ? show : !show"
  >
    <!--  在移动端点击 snackbar 会触发 click:outside
          只能先用 prevent 禁用默认 click:outside，然后自己处理 click:outside  -->
    <v-carousel
      v-model="indexInternal"
      :height="photoHeight"
      hide-delimiters
    >
      <v-carousel-item
        v-for="(photo, i) in photos"
        :key="photo.id"
      >
        <v-sheet dark>
          <v-img
            contain
            :height="photoHeight"
            :width="photoWidth"
            :src="getOnedriveFileUrl(photo.id)"
          >
            <template v-slot:placeholder>
              <PicturePlaceholderAlt/>
            </template>
          </v-img>
          <!--  关闭按钮  -->
          <v-btn absolute top right icon @click="show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <!-- 手写的分隔符  -->
          <v-card-text class="delimiters">{{ indexInternal + 1 }} / {{ count }}</v-card-text>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <!--  图片信息  -->
    <v-sheet
      v-if="show"
      class="mb-0"
      :height="photoInfoHeight"
    >
      <!-- 标题和封面图标  -->
      <v-card-title>
        {{ photos[indexInternal].filename }}
        <v-icon class="rotate45" v-if="isBanner">mdi-pin</v-icon>
      </v-card-title>

      <v-card-actions>
        <!--  上传者  -->
        <PeopleChip :user-id="photos[indexInternal].uploader_id"/>
        <v-spacer/>
        <!--  下载按钮  -->
        <v-btn icon @click="downloadOnedriveFile(photos[indexInternal].id)">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <!--  取消封面按钮  -->
        <template v-if="isPresenterOrAdmin">
          <v-btn icon
            v-if="isBanner"
            class="rotate45"
            :loading="settingBannerIndex === indexInternal"
            @click="setBanner(indexInternal, false)"
          >
            <v-icon>mdi-pin-off</v-icon>
          </v-btn>
          <!--  设为封面按钮  -->
          <v-btn
            icon
            v-else
            :loading="settingBannerIndex === indexInternal"
            @click="setBanner(indexInternal, true)"
          >
            <v-icon>mdi-pin</v-icon>
          </v-btn>
          <!--  删除按钮  -->
          <ConfirmDialog @confirm="deletePhoto(indexInternal)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :loading="deletingIndex === indexInternal"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </template>
          </ConfirmDialog>
        </template>
      </v-card-actions>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
.delimiters {
  position: absolute;
  bottom: 0;
  text-align: center;
  text-shadow: rgb(68 68 68) 1px 1px 8px;
}
</style>

<script>
import {getOnedriveFileUrl} from "@/api/cloud";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import PeopleChip from "@/components/ui/user/people-chip";
import {downloadOnedriveFile} from "@/utils/file";
import {deleteActivityPhoto, updateActivityDetail} from "@/api/activity";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";

export default {
  components: {ConfirmDialog, PeopleChip, PicturePlaceholderAlt},
  props: {
    photos: {
      type: Array,
      required: true
    },
    // 图片总数
    count: {
      type: Number,
      required: true
    },
    // -1 表示不显示轮播图
    index: {
      type: Number,
      required: true,
    },
    activity: {
      required: true,
    },
  },

  data() {
    return {
      // 是否显示轮播图
      show: false,
      // 图片下标
      indexInternal: 0,
      settingBannerIndex: -1,
      deletingIndex: -1,

      photoInfoHeight: 120,

      getOnedriveFileUrl,
      downloadOnedriveFile,
      log: window.console.log
    };
  },

  computed: {
    screenWidth() {
      return this.$vuetify.breakpoint.width;
    },
    screenHeight() {
      return this.$vuetify.breakpoint.height;
    },
    mobile() {
      return this.$vuetify.breakpoint.xs;
    },
    photoWidth() {
      return this.mobile ? this.screenWidth : this.screenWidth * 2 / 3;
    },
    photoHeight() {
      return this.mobile ? this.screenHeight - this.photoInfoHeight : this.photoWidth * 9 / 16;
    },

    isPresenterOrAdmin() {
      return this.activity && this.$store.getters.isInListOrAdmin(this.activity.presenter)
    },
    isBanner() {
      return this.activity.banner_id === this.photos[this.indexInternal].id;
    },
  },

  methods: {
    nextPhoto() {
      this.indexInternal = (this.indexInternal + 1) % this.photos.length;
    },
    prevPhoto() {
      this.indexInternal = (this.indexInternal + this.photos.length - 1) % this.photos.length;
    },

    setBanner(indexInternal, val) {
      this.settingBannerIndex = indexInternal;
      let data = {
        banner_id: val ? this.photos[indexInternal].id : null,
      };
      let that = this;
      updateActivityDetail(this.activity.id, data)
        .then(res => {
          that.$emit('update:activity', res.data);
          that.$store.commit('setMsg', '设置成功~');
          this.settingBannerIndex = -1;
        })
        .catch(res => {
          console.warn(res);
          that.$store.commit('setMsg', res.data);
          this.settingBannerIndex = -1;
        })
    },

    deletePhoto(indexInternal) {
      this.deletingIndex = indexInternal;
      let that = this;
      deleteActivityPhoto(this.photos[indexInternal].id)
        .then(res => {
          that.$store.commit('setMsg', '删除成功~');
          // 没别的图片了，需要关掉轮播图
          if (that.photos.length === 1) {
            that.show = false;
            that.$emit('update:photos', []);
            return;
          }
          let new_photos = [...that.photos];
          new_photos.splice(indexInternal, 1);
          that.$emit('update:photos', new_photos);
          // 如果正在浏览后面的照片，需要移动下标
          if (that.deletingIndex < that.indexInternal)
            that.indexInternal--;
          // 删除操作时，carousel 会出现乱动的情况（会修改 indexInternal 为 length-1）
          // 所以利用 nextTick 在下一时刻改回去
          let new_indexInternal = that.indexInternal;
          this.$nextTick().then(() => {
            that.indexInternal = new_indexInternal;
          })
          that.deletingIndex = -1;
        })
        .catch(res => {
          console.warn(res);
          that.$store.commit('setMsg', res.data);
          this.deletingIndex = -1;
        })
    }
  },
  watch: {
    index() {
      if (this.index >= 0) {
        this.indexInternal = this.index;
        this.show = true;
      } else {
        this.show = false;
      }
    },
    indexInternal() {
      // carousel 会在退出的时候乱改 indexInternal
      // 如果 show 为 false，不仅不让他改，还把他改回去
      if (this.show === false) {
        if (this.indexInternal !== -1) this.indexInternal = -1;
        return;
      }
      if (this.indexInternal >= this.photos.length - 2)
        this.$emit('fetchNextPageData')
      if (this.indexInternal !== this.index) {
        this.$emit('update:index', this.indexInternal);
      }
    },
    show() {
      if (this.show !== (this.index >= 0)) {
        this.$emit('update:index', this.show ? this.indexInternal : -1);
      }
    }
  }
}
</script>
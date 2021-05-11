<template>
  <v-dialog
    v-model="show"
    :fullscreen="mobile"
    :width="width"
    persistent
    no-click-animation
    @click:outside="show = mobile ? show : !show"
  >
    <!--  在移动端点击 snackbar 会触发 click:outside
          只能先用 prevent 禁止自带的，然后自己处理 click:outside  -->
    <v-carousel :value="indexInternal" :height="height" hide-delimiters>
      <template v-slot:prev="{on, attrs}">
        <v-btn absolute left icon v-on="on" v-bind="attrs" @click="prevPhoto">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:next="{on, attrs}">
        <v-btn absolute right icon v-on="on" v-bind="attrs" @click="nextPhoto">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </template>

      <v-carousel-item
        v-for="(photo, i) in photos"
        :key="photo.id"
      >
        <v-sheet>
          <v-img
            contain
            :height="height"
            :width="width"
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
      <v-card-title>
        {{ photos[indexInternal].filename }}
        <v-icon class="rotate45" v-if="isBanner">mdi-pin</v-icon>
      </v-card-title>

      <v-card-actions>
        <PeopleChip :user-id="photos[indexInternal].uploader_id"/>
        <v-spacer/>
        <!--  下载、置顶和删除按钮  -->
        <v-btn icon @click="downloadOnedriveFile(photos[indexInternal].id)">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <template v-if="isPresenterOrAdmin">
          <v-btn icon
            v-if="isBanner"
            class="rotate45"
            :loading="settingBannerIndex === indexInternal"
            @click="setBanner(indexInternal, false)"
          >
            <v-icon>mdi-pin-off</v-icon>
          </v-btn>
          <v-btn
            icon
            v-else
            :loading="settingBannerIndex === indexInternal"
            @click="setBanner(indexInternal, true)"
          >
            <v-icon>mdi-pin</v-icon>
          </v-btn>
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
      // 图片下标，设置为 -1 表示不显示
      indexInternal: -1,
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
      return this.screenHeight > this.screenWidth;
    },
    width() {
      return this.mobile ? this.screenWidth : this.screenWidth * 2 / 3;
    },
    height() {
      return this.mobile ? this.screenHeight - this.photoInfoHeight : this.width * 9 / 16;
    },

    isPresenterOrAdmin() {
      return this.activity && this.$store.getters.whiteListOrAdmin(this.activity.presenter)
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
          that.$store.commit('setMsg', res.data);
          this.settingBannerIndex = -1;
        })
    },

    deletePhoto(indexInternal) {
      this.deletingIndex = indexInternal;
      let that = this;
      deleteActivityPhoto(this.photos[indexInternal].id)
        .then(res => {
          let new_photos = [...that.photos];
          new_photos.splice(indexInternal, 1);
          that.$emit('update:photos', new_photos);
          that.$store.commit('setMsg', '删除成功~');
          // 如果正在浏览后面的照片，需要移动下标
          if (that.deletingIndex > that.indexInternal)
            that.indexInternal--;
          that.deletingIndex = -1;
        })
        .catch(res => {
          that.$store.commit('setMsg', res.data);
          this.deletingIndex = -1;
        })
    }
  },
  watch: {
    index() {
      if (this.indexInternal !== this.index) {
        this.indexInternal = this.index;
        this.show = this.indexInternal >= 0;
      }
    },
    indexInternal() {
      if (this.indexInternal !== this.index) {
        this.$emit('update:index', this.indexInternal);
      }
    },
    show() {
      if (this.show !== (this.index >= 0)) {
        this.$emit('update:index', this.show ? this.index : -1);
      }
    }
  }
}
</script>
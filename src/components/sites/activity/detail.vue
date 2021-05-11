<template>
  <div>
    <ErrorAlert v-if="error">
      {{ error }}
    </ErrorAlert>
    <SimpleCard
      v-else-if="activity"
      md="10"
    >
      <template v-slot:before-card-text>
        <!-- 不使用 parallax 的原因，一是效果不明显，二是 parallax 不支持 placeholder -->
        <!--  这里也可以改成轮播图 v-carousel，不过都可以  -->
        <v-img
          aspect-ratio="2.5"
          :src="activity.bannerUrl"
        >
          <template v-slot:placeholder>
            <PicturePlaceholderAlt/>
          </template>
          <v-card-title class="activity-card-title">{{activity.title}}</v-card-title>
        </v-img>
      </template>

      <v-list two-line>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <PeopleChipGroup
                listitem
                :userId="activity.presenter"
              />
            </v-list-item-title>
            <v-list-item-subtitle>主讲人</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">{{ clockIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ formattedTime }}</v-list-item-title>
            <v-list-item-subtitle>时间</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ activity.location }}</v-list-item-title>
            <v-list-item-subtitle>地点</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-qrcode</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div
              id="qrcode"
            />
            <v-list-item-subtitle>签到二维码（签到已开放2333）</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <template v-if="activity.file.length">
          <v-list-item
            v-for="(file, index) in activity.file"
            :key="file.id"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ index === 0 ? "mdi-file" : "" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ file.filename }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatBytes(file.size) }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                text
                @click="downloadFile(file.download_url)"
                target="_blank"
              >
                <v-icon color="primary">mdi-download</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>
        </template>

        <template v-if="activity.link.length">
          <v-list-item
            v-for="(link, index) in activity.link"
            :key="link.id"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ index === 0 ? "mdi-link" : "" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <a
                  :href="formatUrl(link.url)"
                  target="_blank"
                >{{ link.url }}</a>
              </v-list-item-title>
              <v-list-item-subtitle>{{ '链接 ' + (index + 1) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
        </template>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <PeopleChipGroup
                v-if="activity.attender && activity.attender.length"
                listitem
                :userId="activity.attender"
              />
              <span v-else>暂无</span>
            </v-list-item-title>
            <v-list-item-subtitle>参与者（共 {{activity.attender.length}} 人）</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-image</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <ActivityGallery
              v-if="hasPhoto"
              v-model="hasPhoto"
              :activity-id="activityId"
              @update:banner-id="updateBannerId"
            />
            <template v-else>
              <v-list-item-title>暂无</v-list-item-title>
              <v-list-item-subtitle>沙龙图片</v-list-item-subtitle>
            </template>
          </v-list-item-content>
        </v-list-item>

      </v-list>

    </SimpleCard>

    <!-- todo 图片上传、活动签到、活动删除
    用一个 https://vuetifyjs.com/zh-Hans/api/v-speed-dial/ ？
    -->

    <FloatingActionButton
      v-if="isPresenterOrAdmin"
      icon="mdi-pencil"
      color="primary"
      tooltip="编辑"
      @click="gotoActivityDetailEdit"
    />
  </div>
</template>

<script>
import moment from '@/utils/moment'
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/button/floating-action-button";
import ErrorAlert from "@/components/ui/base/error-alert";
import AdminIcon from "@/components/ui/user/admin-icon";
import {getActivityDetail} from "@/api/activity";
import {generateTopPhoto} from "@/utils/activity";
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import {downloadFile, formatBytes, formatUrl} from "@/utils/file";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import {DEBUG} from "@/utils";
import {getTimeIcon} from '@/utils/datetime';
import ActivityGallery from "@/components/ui/photo/activity-gallery";
import MultipleFloatingActionButton from "@/components/ui/base/button/multiple-floating-action-button";

export default {
  components: {
    MultipleFloatingActionButton,
    ActivityGallery,
    PicturePlaceholderAlt,
    PicturePlaceholder,
    PeopleChipGroup,
    AdminIcon,
    ErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    return {
      activity: null,
      hasPhoto: true,
      error: false,

      formatBytes,
      formatUrl,
      downloadFile,
    }
  },

  computed: {
    activityId() {
      return this.$route.params.activityId;
    },
    isPresenterOrAdmin() {
      return this.activity && this.$store.getters.whiteListOrAdmin(this.activity.presenter)
    },

    clockIcon() {
      return getTimeIcon(moment(this.activity.datetime).hour());
    },
    formattedTime() {
      return moment(this.activity.datetime).toChinese();
    }
  },

  methods: {
    gotoActivityDetailEdit() {
      this.$router.push({
        name: 'ActivityDetailEdit', params: {
          userId: this.activity.id,
          activity: this.activity
        }
      });
    },
    updateBannerId(val) {
      this.activity.banner_id = val;
      generateTopPhoto(this.activity);
    }
  },

  watch: {
    activity() {
      if (this.activity)
        generateTopPhoto(this.activity);
    }
  },

  activated() {
    if (DEBUG)
      window.activity = this;
    let that = this;
    this.hasPhoto = true;
    this.activity = this.$route.params.activity;
    if (!this.activity) {
      this.$store.commit('setAppbarLoading', true);

      getActivityDetail(this.activityId)
        .then(response => {
          that.activity = response.data;
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false)
        })
    }
  }
};
</script>
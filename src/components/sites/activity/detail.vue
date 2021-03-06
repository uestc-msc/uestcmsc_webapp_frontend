<template>
  <div>
    <ErrorAlert v-if="errorMsg">
      {{ errorMsg }}
    </ErrorAlert>
    <SimpleCard
      v-else-if="activity"
      md="10"
    >
      <template v-slot:before-card-text>
        <v-img
          height="240"
          :src="activity.bannerUrl"
        >
          <template v-slot:placeholder>
            <PicturePlaceholderAlt/>
          </template>
          <v-card-title class="activity-card-title">{{ activity.title }}</v-card-title>
          <CheckInStatusButton :activity="activity"/>
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
                :user-id="activity.presenter"
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

        <template v-if="isPresenterOrAdmin">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">mdi-qrcode</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <ErrorAlert v-if="QRCodeErrorMsg" as-row>
                {{ QRCodeErrorMsg }}
              </ErrorAlert>
              <v-responsive v-else>
                <v-img :src="QRCodeData" height="150" width="150"/>
              </v-responsive>
              <v-list-item-subtitle>签到二维码</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn text icon @click="downloadQRCode">
                <v-icon color="primary">mdi-download</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>
        </template>

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
              <v-btn text icon :href="file.download_link" target="_blank">
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
                :user-id="activity.attender"
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
import {qrcanvas} from "qrcanvas";
import {DEBUG, logoUrl} from "@/utils";
import moment from '@/utils/moment'
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/button/floating-action-button";
import ErrorAlert from "@/components/ui/base/error-alert";
import AdminIcon from "@/components/ui/user/admin-icon";
import {getActivityAdminDetail, getActivityDetail} from "@/api/activity";
import {generateTopPhoto} from "@/utils/activity";
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import {downloadUrl, formatBytes, formatUrl} from "@/utils/file";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import {getTimeIcon} from '@/utils/datetime';
import ActivityGallery from "@/components/ui/photo/activity-gallery";
import MultipleFloatingActionButton from "@/components/ui/base/button/multiple-floating-action-button";
import CheckInStatusButton from "@/components/ui/activity/check-in-status-button";

export default {
  components: {
    CheckInStatusButton,
    MultipleFloatingActionButton,
    ActivityGallery,
    PicturePlaceholderAlt,
    PicturePlaceholder,
    PeopleChipGroup,
    AdminIcon,
    ErrorAlert,
    FloatingActionButton,
    SimpleCard,
  },

  data() {
    return {
      activity: null,
      checkInStatus: {
        text: '',
        icon: '',
        color: ''
      },
      // https://github.com/gera2ld/qrcanvas
      QRCodeOption: {
        cellSize: 4,
        correctLevel: 'H',
        data: '',
        logo: '',
        background: 'white',
      },
      QRCodeErrorMsg: false,

      hasPhoto: true,
      errorMsg: false,

      formatBytes,
      formatUrl,
    }
  },

  computed: {
    activityId() {
      return this.$route.params.activityId;
    },
    isPresenterOrAdmin() {
      return this.activity && this.$store.getters.isInListOrAdmin(this.activity.presenter)
    },
    clockIcon() {
      return getTimeIcon(moment(this.activity.datetime).hour());
    },
    formattedTime() {
      return moment(this.activity.datetime).toChinese();
    },
    QRCodeData() {
      const canvas = qrcanvas(this.QRCodeOption);
      return canvas.toDataURL();
    }
  },

  methods: {
    downloadQRCode() {
      let downloadQRCodeOption = Object.assign({}, this.QRCodeOption);
      downloadQRCodeOption.padding = downloadQRCodeOption.cellSize;
      const canvas = qrcanvas(downloadQRCodeOption);
      const data = canvas.toDataURL();
      downloadUrl(data, this.activity.title + '.png');
    },
    gotoActivityDetailEdit() {
      this.$router.push({
        name: 'ActivityDetailEdit', params: {
          activityId: this.activity.id,
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
    },
  },

  async activated() {
    if (DEBUG)
      window.activity = this;
    let that = this;
    this.hasPhoto = true;
    this.activity = this.$route.params.activity;
    // 加载活动信息
    if (!this.activity) {
      this.$store.commit('setAppbarLoading', true);
      try {
        let response = await getActivityDetail(this.activityId);
        this.activity = response.data;
      }
      catch (response) {
        console.warn(response);
        that.errorMsg = response.data;
        return;
      }
      that.$store.commit('setAppbarLoading', false);
    }
    // 设置 Appbar Title
    this.$store.commit('setTitle', this.activity.title);
    if (this.isPresenterOrAdmin) {
      // 异步加载签到码 然后生成二维码
      getActivityAdminDetail(this.activityId)
        .then(response => {
          const checkInCode = response.data.check_in_code;
          const checkInUrl = `${window.location.origin}/activity/${that.activityId}/checkin/${checkInCode}`;
          that.QRCodeOption = Object.assign({}, that.QRCodeOption, {
            data: checkInUrl,
          });
        })
        .catch(response => {
          console.warn(response);
          that.QRCodeOption = response.data;
        })
      // 异步加载二维码中心的图标
      const image = new Image();
      image.src = logoUrl;
      image.onload = () => that.QRCodeOption = Object.assign({}, that.QRCodeOption, {logo: image});
    }
  },
  deactivated() {
    this.$store.commit('clearTitle');
  }
};
</script>
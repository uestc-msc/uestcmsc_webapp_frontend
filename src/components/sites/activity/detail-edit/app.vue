<template>
  <div>
    <ErrorAlertComponent v-if="error">
      {{ error }}
    </ErrorAlertComponent>
    <SimpleCard
      v-else
      md="10">
      <v-tabs
        v-model="currentTab"
        fixed-tabs
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab
          v-for="item in tabNames"
          :key="item"
        >
          {{ item }}
      </v-tab>
    </v-tabs>

      <v-tabs-items v-model="currentTab">
        <v-tab-item>
          <ActivityInfo
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{bottomTips[0]}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityPresenterAndAttender
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{bottomTips[1]}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityFile
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <v-divider/>
          <ActivityLink
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{bottomTips[2]}}</div>
        </v-tab-item>

        <v-tab-item>
          <Gallery
            :disabled="status === Status.submitting"
            :activity.sync="activity"
            :toggle-upload-photo="toggleUploadPhoto"
          />
          <div class="bottom-tips">{{ bottomTips[3] }}</div>
        </v-tab-item>

      </v-tabs-items>

    </SimpleCard>

    <FloatingActionButton
      v-if="currentTab === 3"
      icon="mdi-upload"
      color="primary"
      tooltip="上传图片"
      @click="toggleUploadPhoto=!toggleUploadPhoto"
    />
    <FloatingActionButton
      v-else
      :icon="StatusIcon[status]"
      :color="StatusColor[status]"
      :loading="status === Status.submitting"
      tooltip="保存"
      @click="updateData"
    />
  </div>
</template>

<script>
import '../../../../assets/common/common.css';
import SimpleCard from "@/components/ui/base/simple-card";
import ActivityInfo from "@/components/sites/activity/detail-edit/info";
import ActivityPresenterAndAttender from "@/components/sites/activity/detail-edit/presenter-and-attender";
import {getActivityDetail, updateActivityDetail} from "@/api/activity";
import ActivityFile from "@/components/sites/activity/detail-edit/file";
import ActivityLink from "@/components/sites/activity/detail-edit/link";
import Gallery from "@/components/sites/activity/detail-edit/photos";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import {DEBUG, displayErrorTime, displaySuccessTime, sleep} from "@/utils";
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import ErrorAlertComponent from "@/components/ui/base/error-alert-component";
import {Status, StatusColor, StatusIcon} from "@/utils/status";

export default {
  components: {
    ErrorAlertComponent,
    ErrorAlertRow,
    FloatingActionButton,
    Gallery, ActivityLink, ActivityFile, ActivityPresenterAndAttender, ActivityInfo, SimpleCard
  },
  data() {
    return {
      tabNames: ['沙龙信息', '主讲人和参与人', '文件和链接', '相册'],
      bottomTips: [
        '修改完成后请记得保存哦~',
        '参与人名单会即时提交，修改主讲人后请记得保存哦~',
        '文件和链接会即时上传，不用担心数据丢失~',
        '图片会即时上传，不用担心图片丢失~'
      ],
      currentTab: null,
      activity: null,
      error: null,
      status: Status.editing,
      Status,
      StatusColor,
      StatusIcon,

      toggleUploadPhoto: false
    };
  },

  methods: {
    fetchData() {
      this.$store.commit('setAppbarLoading', true);
      let that = this;
      getActivityDetail(this.activityId)
        .then(response => {
          that.activity = response.data;
          this.$store.commit('setTitle', that.activity.title);
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false);
        });
    },

    updateData() {
      if (this.status !== Status.editing)
        return;

      this.status = Status.submitting;
      updateActivityDetail(this.activityId, this.activity)
        .then(async res => {
          this.activity = res.data;
          this.status = Status.success;
          await sleep(displaySuccessTime);
          this.status = Status.editing;
        })
        .catch(async res => {
          this.status = Status.error;
          this.$store.commit('setMsg', res.data);
          await sleep(displayErrorTime);
          this.status = Status.editing;
        })
    }
  },

  activated() {
    if (!DEBUG)
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
    this.activity = this.$route.params.activity;
    this.activityId = this.$route.params.activityId;
    // 如果有 activity 就直接用，没有就赶紧 fetch
    if (this.activity)
      this.$store.commit('setTitle', this.activity.title);
    else
      this.fetchData();
  },

  deactivated() {
    window.onbeforeunload = null;
    this.$store.commit('clearTitle');
  }
}
</script>
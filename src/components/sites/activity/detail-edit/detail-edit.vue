<template>
  <div>
    <SimpleCard
      md="10">
      <v-tabs
        v-model="currentTab"
        center-active
        grow
        icons-and-text
      >
        <v-tab
          v-for="{name, icon} in tabsInfo"
          :key="name"
        >
          {{ name }}
          <v-icon>{{icon}}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab">
        <v-tab-item>
          <ActivityInfo
            ref="info"
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{tabsInfo[0].tips}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityPresenterAndAttender
            ref="presenterAndAttender"
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{tabsInfo[1].tips}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityFile
            ref="file"
            :disabled="status === Status.submitting"
            @update:disabled="(val) => status = val ? Status.submitting : Status.editing"
            :activity.sync="activity"
          />
          <v-divider/>
          <ActivityLink
            ref="link"
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{tabsInfo[2].tips}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityPhoto
            ref="photo"
            :disabled="status === Status.submitting"
            :activity.sync="activity"
          />
          <div class="bottom-tips">{{ tabsInfo[3].tips }}</div>
        </v-tab-item>
      </v-tabs-items>

      <ErrorAlert
        as-row
        v-if="status === Status.error"
        :msg="errorMsg || '好像发生了什么错误，但是好像又什么都没说'"
      />

    </SimpleCard>

    <FloatingActionButton
      :icon="StatusIcon[status]"
      :color="StatusColor[status]"
      :loading="status === Status.submitting"
      tooltip="保存"
      @click="updateData"
    />
  </div>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import ActivityInfo from "@/components/sites/activity/detail-edit/info";
import ActivityPresenterAndAttender from "@/components/sites/activity/detail-edit/presenter-and-attender";
import {getActivityDetail, updateActivityDetail} from "@/api/activity";
import ActivityFile from "@/components/sites/activity/detail-edit/file";
import ActivityLink from "@/components/sites/activity/detail-edit/link";
import ActivityPhoto from "@/components/sites/activity/detail-edit/photos";
import FloatingActionButton from "@/components/ui/base/button/floating-action-button";
import {DEBUG, displayErrorTime, displaySuccessTime, sleep} from "@/utils";
import {Status, StatusColor, StatusIcon} from "@/utils/status";
import ErrorAlert from "@/components/ui/base/error-alert";
import BottomLine from "@/components/ui/base/bottom-line";
import {isPresenterOrAdminOrGoHome} from "@/utils/permissions";

export default {
  components: {
    BottomLine,
    ErrorAlert,
    FloatingActionButton,
    ActivityPhoto, ActivityLink, ActivityFile, ActivityPresenterAndAttender, ActivityInfo, SimpleCard
  },
  data() {
    return {
      tabsInfo: [{
        name: '沙龙信息',
        icon: 'mdi-clock',
        tips: '修改完成后请记得保存哦~',
      },
      {
        name: '主讲人和参与人',
        icon: 'mdi-account',
        tips: '参与人名单会即时提交，修改主讲人后请记得保存哦~',
      },
      {
        name: '文件链接',
        icon: 'mdi-file',
        tips: '文件和链接会即时上传，不用担心数据丢失~',
      },
      {
        name: '相册',
        icon: 'mdi-image',
        tips: '图片会即时上传，不用担心图片丢失~',
      }],
      childRefs: {
        info: 0,
        presenterAndAttender: 1,
        file: 2,
        link: 2
      },
      currentTab: 0,
      activity: null,
      errorMsg: null,
      status: Status.editing,
      Status,
      StatusColor,
      StatusIcon,
    };
  },

  computed: {
    activityId() {
      return this.$route.params.activityId;
    },
  },

  methods: {
    fetchData() {
      this.$store.commit('setAppbarLoading', true);
      let that = this;
      return getActivityDetail(this.activityId)
        .then(response => {
          that.activity = response.data;
          this.$store.commit('setTitle', that.activity.title);
        })
        .catch(response => {
          console.warn(response);
          that.errorMsg = response.data;
          that.status = Status.error;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false);
        });
    },

    updateData() {
      if (this.status !== Status.editing)
        return;
      let that = this;
      // 检查每个 tab 下的 form 是否正确，不正确就跳到这个 tab
      // 注意尚未加载的 tab 是没有 refs 的
      for (let child in this.childRefs) {
        if (this.$refs[child] && this.$refs[child].$refs.form.validate() === false) {
          this.currentTab = this.childRefs[child];
          this.status = Status.error;
          sleep(displayErrorTime).then(() => that.status = Status.editing)
          return;
        }
      }
      this.status = Status.submitting;
      updateActivityDetail(this.activityId, this.activity)
        .then(async res => {
          this.$store.commit('setTitle', this.activity.title);
          this.activity = res.data;
          this.status = Status.success;
          await sleep(displaySuccessTime);
          this.status = Status.editing;
        })
        .catch(async res => {
          console.warn(res);
          this.status = Status.error;
          this.errorMsg = res.data;
          await sleep(displayErrorTime);
          this.status = Status.editing;
        })
    }
  },

  async activated() {
    if (!DEBUG)
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
    this.activity = this.$route.params.activity;
    // 如果有 activity 就直接用，没有就赶紧 fetch
    if (this.activity)
      this.$store.commit('setTitle', this.activity.title);
    else
      await this.fetchData();
    isPresenterOrAdminOrGoHome(this.activity.presenter);
  },

  deactivated() {
    window.onbeforeunload = null;
    this.$store.commit('clearTitle');
  }
}
</script>
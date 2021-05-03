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
          <ActivityInfo :activity="activity" @updated="updateActivity"/>
          <div class="bottom-tips">{{bottomTips[0]}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityPresenterAndAttender :activity="activity" @updated="updateActivity"/>
          <div class="bottom-tips">{{bottomTips[1]}}</div>
        </v-tab-item>

        <v-tab-item>
          <ActivityFile :activity="activity" @updated="updateActivity"/>
          <v-divider/>
          <ActivityLink :activity="activity" @updated="updateActivity"/>
          <div class="bottom-tips">{{bottomTips[2]}}</div>
        </v-tab-item>

        <v-tab-item>
          <Gallery :activity="activity" @updated="updateActivity"/>
          <div class="bottom-tips">{{bottomTips[3]}}</div>
        </v-tab-item>

      </v-tabs-items>
    </SimpleCard>

    <FloatingActionButton
      icon="mdi-content-save"
      color="primary"
      tooltip="保存"
    />
  </div>
</template>

<script>
import '../../../../assets/common/common.css';
import SimpleCard from "@/components/ui/base/simple-card";
import ActivityInfo from "@/components/sites/activity/detail-edit/info";
import ActivityPresenterAndAttender from "@/components/sites/activity/detail-edit/presenter-and-attender";
import {getActivityDetail} from "@/api/activity";
import ActivityFile from "@/components/sites/activity/detail-edit/file";
import ActivityLink from "@/components/sites/activity/detail-edit/link";
import Gallery from "@/components/sites/activity/detail-edit/gallery";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import {DEBUG} from "@/utils";
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import ErrorAlertComponent from "@/components/ui/base/error-alert-component";

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
        '修改完成后请记得保存哦~',
        '文件和链接都会即时保存，不用担心数据丢失~',
        '相册会即时保存，不用担心图片丢失~'
      ],
      currentTab: null,
      activity: null,
      error: null
    };
  },

  methods: {
    updateActivity(value) {
      console.log('activity updated');
      this.activity = value;
    }
  },

  activated() {
    // TODO: 从一个活动切到另一个活动，数据没有刷新
    if (!DEBUG)
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
    this.activity = this.$route.params.activity;
    this.activityId = this.$route.params.activityId;
    if (this.activity && this.activity.title)
      this.$store.commit('setTitle', this.activity.title);

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

  deactivated() {
    window.onbeforeunload = null;
    this.$store.commit('clearTitle');
  }
}
</script>
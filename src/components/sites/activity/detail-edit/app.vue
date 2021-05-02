<template>
  <SimpleCard md="10">
    <v-tabs
      v-model="currentTab"
      fixed-tabs
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        v-for="item in ['沙龙信息', '主讲人和参与人', '文件和链接']"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab">
      <v-tab-item>
        <ActivityInfo :activity="activity" @updated="updated"/>
      </v-tab-item>

      <v-tab-item>
        <ActivityPresenterAndAttender :activity="activity" @updated="updated"/>
      </v-tab-item>

      <v-tab-item>
        <ActivityFileAndLink :activity="activity" @updated="updated"/>
      </v-tab-item>
    </v-tabs-items>

  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import ActivityFileAndLink from "@/components/sites/activity/detail-edit/file-and-link";
import ActivityInfo from "@/components/sites/activity/detail-edit/info";
import ActivityPresenterAndAttender from "@/components/sites/activity/detail-edit/presenter-and-attender";
import {getActivityDetail} from "@/api/activity";
import {generateTopPhoto} from "@/utils/activity";

export default {
  components: {ActivityPresenterAndAttender, ActivityInfo, ActivityFileAndLink, SimpleCard},
  data() {
    return {
      currentTab: null,
      activity: null
    };
  },

  methods: {
    updated(value) {
      this.activity = value;
    }
  },

  activated() {
    window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
    this.activity = this.$route.params.activity;
    this.$store.commit('setAppbarLoading', true);
    this.activityId = this.$route.params.activityId;
    let that = this;
    getActivityDetail(this.activityId)
      .then(response => {
        that.activity = response.data;
      })
      .catch(response => {
        that.error = response.data;
      })
      .finally(() => {
        that.$store.commit('setAppbarLoading', false)
      });
  },

  deactivated() {
    window.onbeforeunload = null;
  }
}
</script>
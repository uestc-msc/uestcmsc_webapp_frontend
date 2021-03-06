<template>
  <div>
    <ErrorAlert v-if="errorMsg">
      {{ errorMsg }}
    </ErrorAlert>

    <!--  用卡片的形式展示活动，需要考虑活动数为 0 的情况  -->
    <template v-else-if="activityData.length">
      <v-container>
        <v-row
          v-for="activity in activityData"
          :key="activity.id"
          justify="center"
        >
          <v-col cols="12" md="8">
            <ActivityCard :activity="activity"/>
          </v-col>
        </v-row>
      </v-container>

      <v-pagination v-model="page" :length="length"/>
    </template>

    <BottomLine v-else/>

    <FloatingActionButton
      v-if="$store.getters.isAuthenticated"
      icon="mdi-plus"
      color="primary"
      tooltip="创建沙龙"
      @click="gotoCreateActivity"
    />

  </div>
</template>

<script>
import ActivityCard from '@/components/ui/activity/activity-card';
import FloatingActionButton from "@/components/ui/base/button/floating-action-button";
import debounce from 'lodash/debounce';
import {debounceTime} from "@/utils";
import ErrorAlert from "@/components/ui/base/error-alert";
import BottomLine from "@/components/ui/base/bottom-line";
import {getActivityList} from "@/api/activity";

export default {
  components: {BottomLine, ErrorAlert, FloatingActionButton, ActivityCard},
  data: () => ({
    activityData: [],
    page: 1,
    pageSize: 5,
    count: 0,
    errorMsg: false
  }),

  computed: {
    length() {
      return Math.ceil(this.count / this.pageSize);
    }
  },

  methods: {
    fetchData() {
      this.$store.commit('setAppbarLoading', true);
      let keyword = this.$store.state.searchKeyword;
      let that = this;
      return getActivityList(keyword, this.page, this.pageSize)
        .then(response => {
          that.count = response.data.count;
          that.activityData = response.data.results;
        })
        .catch(response => {
          console.warn(response);
          that.errorMsg = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false)
        })
    },

    gotoCreateActivity(user) {
      this.$router.push({
        name: 'CreateActivity'
      });
    }
  },

  watch: {
    page() {
      this.fetchData().then(() =>
        // 页数变化后滑动到顶端
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        }))
    }
  },

  activated() {
    this.fetchData();
    this.debouncedFetchData = debounce(this.fetchData, debounceTime);
    let that = this;
    this.$store.commit('setSearchCallback', function () {
      that.page = 1; // 搜索关键词变化后，记得将页数改为 1
      that.$store.commit('setAppbarLoading', true); // 立即设置加载条
      that.debouncedFetchData();
    });
  },

  deactivated() {
    this.$store.commit('clearSearchCallback')
  }
};
</script>

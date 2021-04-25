<template>
  <div>
    <PageErrorAlert v-if="error">
      {{ error }}
    </PageErrorAlert>

    <!--  用卡片的形式展示活动，需要考虑活动数为 0 的情况  -->
    <template v-else-if="activityData.length">
      <v-container>
        <v-row
          v-for="activity in activityData"
          :key="activity.id"
          justify="center"
        >
          <v-col :xs="12" :md="10">
            <ActivityCard
              :activity="activity"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-pagination v-model="page" :length="length"/>
    </template>

    <BottomLine v-else/>

    <FloatingActionButton
      icon="mdi-plus"
      color="primary"
      tooltip="创建沙龙"
      @click="gotoCreateActivity"
    />

  </div>
</template>

<script>
import ActivityCard from '@/components/ui/base/activity-card';
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import debounce from 'lodash/debounce';
import {debounceTime} from "@/utils";
import PageErrorAlert from "@/components/ui/base/page-error-alert";
import BottomLine from "@/components/ui/base/bottom-line";
import {getActivityList} from "@/api/activity";

export default {
  components: {BottomLine, PageErrorAlert, FloatingActionButton, ActivityCard},
  data: () => ({
    activityData: [],
    page: 1,
    pageSize: 5,
    count: 0,
    error: false
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
      getActivityList(keyword, this.page, this.pageSize)
        .then(response => {
          that.count = response.data.count;
          that.activityData = response.data.results;
        })
        .catch(response => {
          that.error = response.data;
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
      this.fetchData();
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

<template>
  <div>
    <ErrorAlert v-if="error">
      {{ error }}
    </ErrorAlert>

    <v-container>
      <v-row dense justify="center">
        <v-col :xs="12" :md="10">
          <ActivityCard />
        </v-col>
      </v-row>
    </v-container>

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
import ErrorAlert from "@/components/ui/base/component-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import {getUserList} from "@/api/user";

export default {
  components: {AdminIcon, ErrorAlert, FloatingActionButton, ActivityCard},
  data: () => ({
    userData: null,
    page: 1,
    pageSize: 12,
    count: null,
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
      getUserList(keyword, this.page, this.pageSize)
        .then(response => {
          that.count = response.data.count;
          that.userData = response.data.results;
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false)
        })
    },

    gotoUserDetail(user) {
      this.$router.push({
        name: 'UserDetail', params: {
          userProfile: user,
          userId: user.id
        }
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
    this.fetchData()
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

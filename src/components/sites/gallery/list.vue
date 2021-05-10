<template>
  <div>
    <ErrorAlert v-if="error">
      {{ error }}
    </ErrorAlert>

    <template v-else-if="activityData.length">
      <v-container>
        <v-row
          v-for="activity in activityData"
          :key="activity.id"
          class="justify-center"
        >
          <v-col xs="12" md="10">
            <v-card
              justify="center"
              @click="gotoActivityDetail(activity)"
            >
              <v-card-title>{{ activity.title }}</v-card-title>
              <v-card-subtitle>{{ formattedTime(activity) }}</v-card-subtitle>
              <ActivityGallery
                v-if="activity.hasPhoto"
                v-model="activity.hasPhoto"
                :activity-id="activity.id"
              />
              <v-card-text v-else>
                暂无图片
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-pagination v-model="page" :length="length"/>
    </template>

    <BottomLine v-else/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import {debounceTime} from "@/utils";
import ErrorAlert from "@/components/ui/base/error-alert";
import BottomLine from "@/components/ui/base/bottom-line";
import {getActivityList} from "@/api/activity";
import SimpleCard from "@/components/ui/base/simple-card";
import moment from "@/utils/moment";
import ActivityGallery from "@/components/ui/photo/activity-gallery";

export default {
  components: {ActivityGallery, SimpleCard, BottomLine, ErrorAlert},
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
    },
  },

  methods: {
    formattedTime(activity) {
      return moment(activity.datetime).toChinese();
    },
    fetchData() {
      this.$store.commit('setAppbarLoading', true);
      let keyword = this.$store.state.searchKeyword;
      let that = this;
      return getActivityList(keyword, this.page, this.pageSize)
        .then(response => {
          that.count = response.data.count;
          that.activityData = response.data.results;
          for (let activity of that.activityData)
            this.$set(activity, 'hasPhoto', true);
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.$store.commit('setAppbarLoading', false)
        })
    },

    gotoActivityDetail(activity) {
      this.$router.push({
        name: 'ActivityDetail',
        params: {
          activity: activity,
          activityId: activity.id
        }
      })
    },
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

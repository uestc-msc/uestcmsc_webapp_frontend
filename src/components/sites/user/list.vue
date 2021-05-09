<template>
  <ErrorAlertPage v-if="error">
    {{ error }}
  </ErrorAlertPage>

  <!--  用表格的形式展示用户，不用考虑用户数为 0 的情况  -->
  <SimpleCard v-else>
    <v-simple-table>
      <thead>
      <tr>
        <th
          v-for="header in headers"
          :key="header"
          class="text-center"
        >
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="user in userData"
        :key="user.id"
        @click="gotoUserDetail(user)"
        class="text-center"
      >
        <td>
          <v-avatar>
            <v-img
              :src="user.avatar_url"
              :lazy-src="lazyAvatar"
            >
              <template v-slot:placeholder>
                  <PicturePlaceholder size="48"/>
              </template>
            </v-img>
          </v-avatar>
        </td>
        <td>
          <span>
            {{ user.first_name }}
          </span>
          <AdminIcon
            :user="user"
            size="14px"
          />
        </td>
        <td>{{ user.experience }}</td>
      </tr>
      </tbody>
    </v-simple-table>

    <v-pagination v-model="page" :length="length"/>
  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import debounce from 'lodash/debounce';
import {lazyAvatar, debounceTime} from "@/utils";
import ErrorAlertPage from "@/components/ui/base/error-alert";
import AdminIcon from "@/components/ui/user/admin-icon";
import {getUserList} from "@/api/user";
import BottomLine from "@/components/ui/base/bottom-line";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

export default {
  components: {PicturePlaceholder, BottomLine, AdminIcon, ErrorAlertPage, SimpleCard, FloatingActionButton},
  data: () => ({
    headers: ['用户', '姓名', '经验'],
    userData: [],
    page: 1,
    pageSize: 12,
    count: 0,
    error: false,
    lazyAvatar,
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

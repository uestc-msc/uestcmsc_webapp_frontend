<template>
  <div>
    <ErrorAlert v-if="error">
      {{ error }}
    </ErrorAlert>
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
              <v-img :src="user.avatar_url"/>
            </v-avatar>
          </td>
          <td>{{ user.first_name }}
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
    <FloatingActionButton
      icon="mdi-plus"
      color="primary"
      tooltip="编辑"
      @click="gotoUserDetailEdit"
    />
  </div>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import debounce from 'lodash/debounce';
import {debounceTime} from "@/utils";
import ErrorAlert from "@/components/ui/base/component-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import {getUserList} from "@/api/user";

export default {
  components: {AdminIcon, ErrorAlert, SimpleCard, FloatingActionButton},
  data: () => ({
    headers: ['用户', '姓名', '经验'],
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

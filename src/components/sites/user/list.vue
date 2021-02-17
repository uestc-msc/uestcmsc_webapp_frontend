<template>
  <ErrorAlert v-if="error">
    {{error}}
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
            {{header}}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="user in userData"
          :key="user.id"
          @click="gotoUserDetail(user.id)"
          class="text-center"
        >
          <td>
            <v-avatar>
              <v-img :src="user.avatar_url"/>
            </v-avatar>
          </td>
          <td>{{ user.first_name }}</td>
          <td>{{ user.experience }}</td>
        </tr>
        </tbody>
    </v-simple-table>

    <v-pagination  v-model = "page" :length = "length"/>
  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import debounce from 'lodash/debounce';
import {debounceTime} from "@/utils";
import axios from "@/utils/axios";
import ErrorAlert from "@/components/ui/base/error-alert";

export default {
  components: {ErrorAlert, SimpleCard},
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
      axios.get(`/users/?search=${keyword}&page=${this.page}&page_size=${this.pageSize}`)
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

    gotoUserDetail(userId) {
      this.$router.push({name: 'UserDetail', params: {userId}})
    }
  },

  watch: {
    page() {
      this.fetchData();
    }
  },

  activated() {
    this.fetchData()
    this.debounceFetchData = debounce(this.fetchData, debounceTime);
    this.$store.commit('setSearchCallback', this.debounceFetchData);
  },

  deactivated() {
    this.$store.commit('clearSearchCallback')
  }
};
</script>

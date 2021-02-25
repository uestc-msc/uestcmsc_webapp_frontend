<!-- appbar: 顶栏 -->
<template>
  <v-app-bar
    fixed
    app
    dark
    short
    color="primary"
  >

    <template v-if="searchCallback && showSearchBar">
      <!--  如果搜索框可以使用，并且用户希望展示，就展示给用户  -->
      <v-btn @click="showSearchBar=false" icon>
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>

      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        @input="searchCallback"
        v-model="keyword"
      />
    </template>

    <template v-else>
      <!--   否则把标题和搜索按钮展示给用户   -->
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer/>

      <v-btn v-if="searchCallback" @click="showSearchBar=true" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>

    <v-toolbar-items>
      <v-btn v-if="!isAuthenticated" text @click="toLogin">
        <v-icon class="mr-2">mdi-login</v-icon>
        <span> 登录 </span>
      </v-btn>

      <user-menu v-else/>
    </v-toolbar-items>

    <v-progress-linear
      :active="$store.state.appbarLoading"
      :indeterminate="$store.state.appbarLoading"
      absolute
      bottom
      color="yellow accent-4"
    ></v-progress-linear>

  </v-app-bar>
</template>


<script>
import {appName} from '@/utils'
import Router from '@/router';
import userMenu from './user-menu.vue';
import { mapGetters } from 'vuex'

export default {
  components: {
    userMenu
  },

  data() {
    return {
      showSearchBar: false,
      appName
    }
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    keyword: {
      get() {
        return this.$store.state.searchKeyword;
      },
      set(value) {
        this.$store.commit('setSearchKeyword', value);
      }
    },
    title() {
      return this.$store.state.title || appName;
    },
    searchCallback() {
      return this.$store.state.searchCallback;
    },
  },

  methods: {
    toLogin() {
      Router.push({
        name: 'Login',
      });
    },
  },
};
</script>

<!-- appbar: 顶栏 -->
<template>
  <v-app-bar
    fixed
    app
    dark
    short
    color="primary"
  >
    
    <v-toolbar-title>
      {{ $store.state.title }}
    </v-toolbar-title>

    <v-spacer/>

    <v-toolbar-items>
      <v-btn v-if = "!isAuthenticated" text @click = "toLogin">
        <v-icon class = "mr-2" >mdi-login</v-icon>
        <span> 登录 </span>
      </v-btn>

      <user-menu v-else />
    </v-toolbar-items>
  </v-app-bar>
</template>


<script>
import Vue from 'vue';

import Router from '@/router';
import userMenu from './user-menu.vue';
import { isAuthenticated } from '@/utils/permissions.js'

export default {
  components: {
    userMenu
  },
  computed: {
    isAuthenticated,
  },

  methods: {
    toLogin: () => {
      Router.push({
        name: 'Login',
      });
    },
  },
};
</script>

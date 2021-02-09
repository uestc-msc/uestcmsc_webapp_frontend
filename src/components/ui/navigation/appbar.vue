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
      {{ title }}
    </v-toolbar-title>

    <v-spacer/>

    <v-btn
      class="mx-4"
      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
      icon
    >
      <v-icon size="24px">
        mdi-brightness-6
      </v-icon>
    </v-btn>

    <v-toolbar-items>
      <v-btn v-if = "!isAuthenticated" text @click = "toLogin">
        <v-icon class = "mr-2" >mdi-login</v-icon>
        <span> 登录 </span>
      </v-btn>

      <user-menu v-else />
    </v-toolbar-items>
  </v-app-bar>
</template>


<script lang="ts">
// / <reference path="../../../types/index.d.ts" />
import Vue from 'vue';

import Router from '@/router';
import userMenu from './user-menu.vue';
import { isAuthenticated } from '@/utils/permissions.js'

export default {
  props: {
    profile: {
      type: User,
      default: {},
    },
  },

  computed: {
    title() {
      // return this.$root.title || "阮薇薇点名啦";
      return "阮薇薇点名啦";
    },
    isAuthenticated
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

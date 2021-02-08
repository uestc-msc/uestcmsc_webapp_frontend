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
    </v-toolbar-items>

  </v-app-bar>
</template>


<script>
import Vue from 'vue';
import Router from '@/router/index';

export default Vue.extend({
  props: {
    profile: {
      type: Object,
      default: null,
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    title() {
      return this.$root.title;
    },
  },

  methods: {
    toLogin: () => {
      Router.push({
        name: 'Login',
      });
    },
  },
});
</script>

<!-- appbar: 顶栏 -->
<template>
  <v-app-bar fixed app dark color="primary"> <!-- clipped-left -->
    <!-- <v-app-bar-nav-icon @click.stop = "$emit( 'input-toggle-drawer' , $event )"/> -->
    
    <v-toolbar-title>
      {{ title }}
    </v-toolbar-title>

    <v-spacer/>
    <v-toolbar-items>
      <v-switch
        v-model="$vuetify.theme.dark"
        color="red"
        label="Dark Mode"
        hint="for debug only"
        persistent-hint
      ></v-switch>
    </v-toolbar-items>
    <v-toolbar-items>
      <v-btn v-if = "!isAuthenticated" text @click = "toLogin">
        <v-icon class = "mr-2" >mdi-login</v-icon>
        <span> 登录 </span>
      </v-btn>
      <user-menu-mobile
        v-else-if = "$vuetify.breakpoint.xsOnly"
        :profile = "profile"
      />
      <user-menu
        v-else
        :profile = "profile"
      />
    </v-toolbar-items>

  </v-app-bar>
</template>


<script>
import Vue from 'vue';
import UserMenu from './user-menu';
import UserMenuMobile from './user-menu-mobile';
import Router from '@/router/index';

export default Vue.extend({
  components: {
    UserMenu,
    UserMenuMobile,
  },

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

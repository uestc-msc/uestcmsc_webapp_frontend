<!-- 整合侧边栏的抽屉、顶栏 -->
<template>
  <div>
    <Drawer
      :toggle-event = "toggleEvent"
      :title = "title"
    />
    <AppBar
      :profile = "profile"
      :is-authenticated = "isAuthenticated"
      :title = "title"
      @input-toggle-drawer = "toggleEvent = !toggleEvent"
    />
  </div>
</template>


<script lang="ts">

import Vue from 'vue'
import AppBar from './appbar.vue';
import Drawer from './drawer.vue';

export default Vue.extend({

  components: {
    AppBar,
    Drawer,
  },

  data() {
    return {
      toggleEvent: false,
    };
  },

  computed: {
    // ...mapGetters({
    //   // profile: 'user/profile',
    //   // isAuthenticated: 'user/isAuthenticated',
    //   // isProgressBarVisible: 'navbar/visible',
    //   // title: 'navbar/title',
    // }),
  },
});
</script>

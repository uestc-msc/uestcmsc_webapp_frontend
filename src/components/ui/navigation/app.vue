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


<script>

// import { mapGetters } from 'vuex';
import AppBar from './appbar';
import Drawer from './drawer';

export default {

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
};
</script>

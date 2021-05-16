<!-- 整合侧边栏的抽屉、顶栏 -->
<template>
  <div>
    <NavigationDrawer :toggleEvent="toggleNavigation"/>
    <AppBar
      @toggleNavigation="toggleNavigation=!toggleNavigation"
      @toggleSettings="toggleSettings=!toggleSettings"
    />
    <SettingsDrawer :toggleEvent="toggleSettings"/>
  </div>
</template>

<script>
import Vue from 'vue'
import AppBar from './appbar.vue';
import NavigationDrawer from './navigation-drawer.vue';
import SettingsDrawer from './settings-drawer/settings-drawer.vue';

export default Vue.extend({
  components: {
    AppBar,
    NavigationDrawer,
    SettingsDrawer
  },
  data: () => ({
    // 因为事件只能向上传递，值只能向下传递
    // 这里向下传递 toggleEvent 触发下面的事件，达到“向下传递事件”的效果
    toggleNavigation: false,
    toggleSettings: false
  })
});
</script>

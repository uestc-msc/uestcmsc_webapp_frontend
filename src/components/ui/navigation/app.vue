<!-- 整合侧边栏的抽屉、顶栏 -->
<template>
  <div>
    <Drawer
      :toggleEvent="toggleEvent"
    />
    <AppBar
      @toggleDrawer="toggleEvent=!toggleEvent"
    />
  </div>
</template>


<script>
import Vue from 'vue'
import AppBar from './appbar.vue';
import Drawer from './drawer.vue';

export default Vue.extend({
  components: {
    AppBar,
    Drawer,
  },
  data: () => ({
    // 因为事件只能向上传递，值只能向下传递
    // 这里向下传递 toggleEvent 触发下面的事件，达到“向下传递事件”的效果
    toggleEvent: false
  })
});
</script>

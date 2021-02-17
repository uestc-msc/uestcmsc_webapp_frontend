<!-- 整合侧边栏的抽屉、顶栏 -->
<template>
  <div>
    <Drawer/>
    <AppBar/>
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
  }
});
</script>

<template>
  <ScreenInfo/>
</template>

<script>
import ScreenInfo from "@/components/sites/debug/screen-info";

export default {
  components: {ScreenInfo},
  activated() {
    this.$store.commit('setTitle', '调试信息');
  },

  deactivated() {
    this.$store.commit('clearTitle');
  }
}
</script>
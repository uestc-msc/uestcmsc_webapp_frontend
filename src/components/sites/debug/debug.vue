<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" md="8">
          <v-expansion-panels>
            <ProxyGuide/>
            <ScreenInfo/>
            <RecentErrorRequests/>
          </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ScreenInfo from "@/components/sites/debug/module/screen-info";
import RecentErrorRequests from "@/components/sites/debug/module/recent-error-requests";
import ProxyGuide from "@/components/sites/debug/module/proxy-guide";

export default {
  components: {ProxyGuide, RecentErrorRequests, ScreenInfo},

  activated() {
    this.$store.commit('setTitle', '调试信息');
  },

  deactivated() {
    this.$store.commit('clearTitle');
  }
}
</script>
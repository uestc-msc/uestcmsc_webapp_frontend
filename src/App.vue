<template>
  <v-app>
    <v-main>
      <app-navigation-bar/>
      <div class="maincontent">
        <v-fade-transition
            :duration="100"
            mode="out-in"
        >
          <keep-alive>
            <router-view/>
          </keep-alive>
        </v-fade-transition>
      </div>
    </v-main>
    <Footer/>
    <Snackbar/>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Footer from '@/components/ui/footer/app.vue';
import AppNavigationBar from '@/components/ui/navigation/app.vue';
import Snackbar from '@/components/ui/snackbar/app.vue';
import axios from "@/utils/axios";

export default Vue.extend({
  name: 'App',

  components: {
    AppNavigationBar,
    Footer,
    Snackbar,
  },

  created() {
    let that = this;
    // 配置黑暗模式
    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.$vuetify.theme.dark = true;
    }
    // 尝试使用上次的 sessionid 自动登录
    axios.get('/users/whoami/')
      .then((response) => {
        that.$store.commit('saveProfile', response.data)
      })
      .catch(() => {})
  }
});
</script>

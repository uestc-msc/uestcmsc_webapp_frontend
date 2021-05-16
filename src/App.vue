<template>
  <v-app>
    <v-main>
      <AppNavigationBar/>   <!-- 整合侧边栏的抽屉 Navigation Drawer 和顶栏 App Bar-->
      <div class="maincontent">
        <v-fade-transition :duration="100"  mode="out-in">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </v-fade-transition>
      </div>
    </v-main>
    <Footer/>                 <!-- 页脚 Footer -->
    <Snackbar/>               <!-- 弹窗消息框  -->
  </v-app>
</template>

<script>
import '@/assets/common/common.css';
import Vue from 'vue';
import Footer from '@/components/ui/footer/footer.vue';
import AppNavigationBar from '@/components/ui/navigation/navigation.vue';
import Snackbar from '@/components/ui/snackbar/snackbar.vue';


export default Vue.extend({
  name: 'App',

  components: {
    AppNavigationBar,
    Footer,
    Snackbar,
  },

  created() {
  }
});
</script>

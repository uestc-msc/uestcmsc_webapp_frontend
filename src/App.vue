<template>
  <v-app>
    <v-main>
      <app-navagation-bar/>
      <div
        class = "maincontent"
        fill-height
      >
        <v-fade-transition
          :duration = "100"
          mode = "out-in"
        >
          <keep-alive>
            <router-view/>
          </keep-alive>
        </v-fade-transition>
      </div>
      <Footer/>
    </v-main>
    <Snackbar/>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Footer from '@/components/ui/footer/app.vue';
import AppNavagationBar from '@/components/ui/navigation/app.vue';
import Snackbar from '@/components/ui/snackbar/app.vue';

export default Vue.extend({
  name: 'App',

  components: {
    AppNavagationBar,
    Footer,
    Snackbar,
  },

  data: () => ({
    //
  }),

  created() {
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.$vuetify.theme.dark = true;
      // dark mode
    }
  }
});
</script>

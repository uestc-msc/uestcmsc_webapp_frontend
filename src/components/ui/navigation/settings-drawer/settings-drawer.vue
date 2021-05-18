<template>
  <v-navigation-drawer
    v-model="show"
    disable-route-watcher
    right
    fixed
    hide-overlay
    temporary
    width="300"
  >

    <v-toolbar flat>
      <v-toolbar-title>设置</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="show = !show">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="mx-0 mx-n3">
      <v-divider/>
    </div>

    <v-container>

      <template v-if="isAuthenticated">
        <UserInfo/>
        <div class="mb-3 mt-4 mx-n3">
          <v-divider/>
        </div>
      </template>

      <UserSettings @hide="show=false"/>
      <div class="mb-3 mt-4 mx-n3">
        <v-divider/>
      </div>

      <ThemeSettings/>
      <div class="mb-3 mt-4 mx-n3">
        <v-divider/>
      </div>

      <SettingsTips/>

    </v-container>

  </v-navigation-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import ThemeSettings from './theme-settings'
import UserSettings from "@/components/ui/navigation/settings-drawer/user-settings";
import UserInfo from "@/components/ui/navigation/settings-drawer/user-info";
import SettingsTips from "@/components/ui/navigation/settings-drawer/settings-tips";

export default {
  props: ['toggleEvent'],

  components: {
    SettingsTips,
    UserInfo,
    UserSettings,
    ThemeSettings,
  },

  data() {
    return {
      show: false
    }
  },

  computed: {
    ...mapGetters(['isAuthenticated'])
  },

  watch: {
    toggleEvent() {
      this.show = !this.show;
    }
  }
}
</script>

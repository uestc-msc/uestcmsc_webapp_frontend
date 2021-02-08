<!-- drawer: 侧边栏的抽屉 -->
<template>
  <v-navigation-drawer
    v-model = "drawer"
    expand-on-hover
    permanent
    :width = "250"
    fixed
    app
  >    <!-- clipped -->
    <v-list-item  class="px-2">
      <v-list-item-avatar>
        <v-img src="/static/icons/favicon-96x96.png" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title  style="font-size:15px">
            {{appName}}<sub style='color:grey'>v{{appVersion}}</sub>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider/>

    <v-list dense nav>
      <v-list-item
        v-for = "item in items"
        :key = "item.title"
        :to = "item.to"
        ripple
        active-class = "grey lighten-3"
        :title = "item.title"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>


<script lang="ts">
import Vue from 'vue'
import { appName, appVersion } from '@/utils'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: null,
    },
    toggleEvent: {
      type: Boolean,
      default: null,
    },
  },

  data() {
    return {
      appName,
      appVersion,
      drawer: !this.$vuetify.breakpoint.xsOnly,
      items: [
        {
          title: '活动',
          icon: 'mdi-compass',
          to: '/activity',
        },
        {
          title: '用户',
          icon: 'mdi-account-multiple',
          to: '/user',
        },
        {
          title: '相册',
          icon: 'mdi-chart-bar',
          to: '/gallery',
        },
        {
          title: '云盘',
          icon: 'mdi-cloud',
          to: '/cloud',
        },
        {
          title: '云盘（管理员）',
          icon: 'mdi-cloud-lock',
          to: '/cloud-admin',
        },
      ],
    };
  },

  watch: {
    toggleEvent() {
      this.drawer = !this.drawer;
    },
  },
});
</script>

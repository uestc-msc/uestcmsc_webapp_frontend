<!-- drawer: 侧边栏的抽屉 -->
<template>
  <v-navigation-drawer
    :width="250"
    fixed
    app
    v-model="show"
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="/static/icons/favicon-96x96.png"/>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title style="font-size:15px">
          {{ appName }}<sub style='color:grey'>v{{ appVersion }}</sub>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider/>

    <v-list dense nav>
      <v-list-item-group color="primary">
        <template v-for="item in items">
          <v-list-item
            v-if="hasPermission(item)"
            v-model="item.value"
            :to="item.to"
            :href="item.href"
            :target="item.href ? '_blank' : '_self'"
            ripple
            active-class="grey lighten-3"
          >
            <v-list-item-action>
              <v-icon>{{ item.value ? (item.iconOn || item.iconOff) : item.iconOff }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-group
          v-if="isAdmin"
          v-model="settingsOn"
          :prepend-icon="settingsOn ? 'mdi-cog' : 'mdi-cog-outline'"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>管理</v-list-item-title>
            </v-list-item-content>
          </template>

          <template v-for="item in itemsAdmin">
            <v-list-item
              v-if="hasPermission(item)"
              v-model="item.value"
              :to="item.to"
              :href="item.href"
              :target="item.href ? '_blank' : '_self'"
              ripple
              active-class="grey lighten-3"
            >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-icon>
                <v-icon>{{ item.value ? (item.iconOn || item.iconOff) : item.iconOff }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>

        </v-list-group>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
import Vue from 'vue'
import {appName, appVersion, baseUrl} from '@/utils'
import {mapGetters} from 'vuex'

export default Vue.extend({
  props: ['toggleEvent'],
  data() {
    return {
      appName,
      appVersion,
      show: null,   //在移动设备上关闭，在桌面环境下打开
      settingsOn: false,
      items: [
        {
          title: '沙龙',
          iconOn: 'mdi-view-dashboard',
          iconOff: 'mdi-view-dashboard-outline',
          to: '/activity',
          value: false,
        },
        {
          title: '用户',
          iconOn: 'mdi-account-multiple',
          iconOff: 'mdi-account-multiple-outline',
          to: '/user',
          value: false,
        },
        {
          title: '相册',
          iconOn: 'mdi-image-multiple',
          iconOff: 'mdi-image-multiple-outline',
          to: '/gallery',
          value: false,
        },
        {
          title: 'Onedrive',
          iconOn: 'mdi-cloud',
          iconOff: 'mdi-cloud-outline',
          href: 'https://demo4c-my.sharepoint.com/:f:/g/personal/uestcmsc_demo4c_onmicrosoft_com/Eq4PHVelleJCpDcY2HqjafcB-y6J0cPalW0Pn6J0wBSaXw?e=RJNaaB',
          requireLogin: true,
          value: false,
        },
      ],
      itemsAdmin: [
        {
          title: 'Onedrive 状态',
          iconOn: 'mdi-sync',
          iconOff: 'mdi-cached',
          to: '/cloud/status',
          value: false,
        },
        {
          title: 'Onedrive 管理',
          iconOn: 'mdi-lock',
          iconOff: 'mdi-lock-outline',
          href: 'https://demo4c-my.sharepoint.com/personal/uestcmsc_demo4c_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fuestcmsc%5Fdemo4c%5Fonmicrosoft%5Fcom%2FDocuments%2Fcloud%2Fpublic',
          value: false,
        },

        {
          title: '后台管理',
          iconOn: 'mdi-account-cog',
          iconOff: 'mdi-account-cog-outline',
          href: baseUrl + '/admin/',
          requireSuperuser: true,
          value: false,
        },
      ]
    };
  },

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isAdmin',
      'isSelfOrAdmin',
      'isSuperuser'
    ]),
  },

  methods: {
    hasPermission(item) {
      return (!item.requireLogin || this.isAuthenticated)
        && (!item.requireSuperuser || this.isSuperuser)
    }
  },

  watch: {
    toggleEvent() {
      this.show = !this.show;
    }
  }
});
</script>

<!-- drawer: 侧边栏的抽屉 -->
<template>
  <v-navigation-drawer
    expand-on-hover
    permanent
    :width="250"
    fixed
    app
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
            :to="item.to"
            :href="item.href"
            ripple
            active-class="grey lighten-3"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-group
          v-if="isAdmin"
          prepend-icon="mdi-cog"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>设置</v-list-item-title>
            </v-list-item-content>
          </template>

          <template v-for="item in itemsAdmin">
            <v-list-item
              v-if="hasPermission(item)"
              :to="item.to"
              :href="item.href"
              ripple
              active-class="grey lighten-3"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
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
  data() {
    return {
      appName,
      appVersion,
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
          icon: 'mdi-image-multiple',
          to: '/gallery',
        },
        {
          title: '云盘',
          icon: 'mdi-cloud',
          href: 'https://demo4c-my.sharepoint.com/:f:/g/personal/uestcmsc_demo4c_onmicrosoft_com/Eq4PHVelleJCpDcY2HqjafcB-y6J0cPalW0Pn6J0wBSaXw?e=RJNaaB',
          requireLogin: true,
        },
      ],
      itemsAdmin: [
        {
          title: '云盘（管理员）',
          icon: 'mdi-cloud-lock',
          href: 'https://demo4c-my.sharepoint.com/personal/uestcmsc_demo4c_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fuestcmsc%5Fdemo4c%5Fonmicrosoft%5Fcom%2FDocuments%2Fcloud%2Fpublic',
        },
        {
          title: '后端管理界面',
          icon: 'mdi-cloud-lock',
          href: baseUrl + '/admin/',
          requireSuperuser: true
        },
      ]
    };
  },

  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isAdmin',
      'isOwnerOrAdmin',
      'isSuperuser'
    ]),
  },

  methods: {
    hasPermission(item) {
      return (!item.requireLogin || this.isAuthenticated)
        && (!item.requireSuperuser || this.isSuperuser)
    }
  }
});
</script>

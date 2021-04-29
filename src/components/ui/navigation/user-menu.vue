<!-- User Menu: 右上角点击头像出现的菜单，连同头像和姓名-->
<template>
  <v-menu
    open-on-hover
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text>
        <v-avatar size="36" contain>
          <v-img :src="profile.avatar_url">
            <template v-slot:placeholder>
              <PicturePlaceholder size="36"/>
            </template>
          </v-img>
        </v-avatar>
        <span class = "ml-2">
          {{ profile.first_name }}
        </span>
        <AdminIcon
          :user="profile"
          size="14px"
        />
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for = "item in items"
        :key = "item.label"
        @click = "item.callback"
        class="text-center"
      >
        <v-icon> {{item.icon}} </v-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.label"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<script>
import AdminIcon from "@/components/ui/user/admin-icon";
import {avatarDefault} from "@/utils";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

export default {
  components: {PicturePlaceholder, AdminIcon},
  data: function () {
    let that = this;
    return {
      items: [
        {
          icon: 'mdi-brightness-6',
          label: '切换主题',
          callback: function () {
            that.$vuetify.theme.dark = !that.$vuetify.theme.dark;
          }
        },
        {
          icon: 'mdi-account',
          label: '个人信息',
          callback: function () {
            that.$router.push({
              name: 'UserDetail',
              params: {userId: that.userId}
            })
          },
        },
        {
          icon: 'mdi-logout',
          label: '登出账号',
          callback: function () {
            that.$router.push({name: 'Logout'})
          }
        },
      ],
      avatarDefault,
    }
  },

  computed: {
    profile() {
      return this.$store.state.profile
    },
    userId() {
      return this.profile.id
    }
  },
};
</script>

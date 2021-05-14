<!-- appbar: 顶栏 -->
<template>
  <v-app-bar
    fixed
    app
    dark
    short
    color="primary"
  >
    <v-app-bar-nav-icon @click="$emit('toggleNavigation')"/>

    <template v-if="searchCallback && showSearchBar">
      <!--  如果搜索框可以使用，并且用户希望展示，就展示给用户  -->
      <!--  TODO: 收起搜索框，过渡动画时标题会出现在偏左的位置，过渡结束后靠右    -->
      <v-fade-transition hide-on-leave>
      <v-btn @click="showSearchBar=false" icon>
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-btn>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        @input="searchCallback"
        v-model="keyword"
      />
      </v-fade-transition>
    </template>

    <template v-else>
      <!--   否则把标题和搜索按钮展示给用户   -->
      <v-fade-transition hide-on-leave>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
      <v-spacer/>
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
      <v-btn v-if="searchCallback" @click="showSearchBar=true" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      </v-fade-transition>
    </template>

    <template v-if="isAuthenticated">
      <v-avatar size="36" contain>
        <v-img :src="profile.avatar_url">
          <template v-slot:placeholder>
            <PicturePlaceholder size="36"/>
          </template>
        </v-img>
      </v-avatar>

      <!--  移动端太挤了放不下  -->
      <template v-if="!mobile">
        <span class="ml-2">
          {{ profile.first_name }}
        </span>
        <AdminIcon class="mr-4" :user="profile" size="14px"/>
      </template>
    </template>

    <v-btn icon @click="$emit('toggleSettings')">
      <v-icon>mdi-cog-outline</v-icon>
    </v-btn>

    <v-progress-linear
      :active="$store.state.appbarLoading"
      indeterminate
      absolute
      bottom
      color="yellow accent-4"
    ></v-progress-linear>

  </v-app-bar>
</template>


<script>
import {appName} from '@/utils'
import Router from '@/router';
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import AdminIcon from "@/components/ui/user/admin-icon";
import {getMyProfile} from "@/api/user";

export default {
  components: {
    AdminIcon,
    PicturePlaceholder,
  },

  data() {
    return {
      showSearchBar: false,
      appName,

    }
  },

  computed: {
    profile() {
      return this.$store.state.profile
    },
    userId() {
      return this.profile.id
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    keyword: {
      get() {
        return this.$store.state.searchKeyword;
      },
      set(value) {
        this.$store.commit('setSearchKeyword', value);
      }
    },
    title() {
      return this.$store.state.title || appName;
    },
    searchCallback() {
      return this.$store.state.searchCallback;
    },
    mobile() {
      return this.$vuetify.breakpoint.xs;
    }
  },

  methods: {
    toLogin() {
      Router.push({
        name: 'Login',
      });
    },
  },

  created() {
    let that = this;
    // 尝试使用上次的 sessionid 自动登录
    getMyProfile().then((res) => {
      that.$store.commit('setProfile', res.data);
    }).catch((res) => {
    });
  }
};
</script>

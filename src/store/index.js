import Vue from 'vue';
import Vuex from 'vuex';
import {appName} from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 当前登录用户信息
    profile: {
      id: -1,
      username: "",
      first_name: "",
      last_name: "",
      student_id: "",
      experience: "",
      about: "",
      subscribe_email: false,
      avatar_url: "",
      last_login: "",
      date_joined: "",
      is_staff: false,
      is_superuser: false
    },
    // 通知栏 snackbar
    snackbar: {
      msg: '',
      visible: false
    },
    // 标题，出现在 Appbar 上
    title: appName,
    // 需要搜索栏的 component 将 input 函数绑在它上
    searchCallback: null
  },

  getters: {
    isAuthenticated(state) {
      return state.profile.id > 0;
    }
  },

  mutations: {
    saveProfile(state, profile) {
      state.profile = { ...state.profile, ...profile};
    },
    clearProfile(state) {
      state.profile = {"id": -1};
    },

    postMsg(state, msg) {
      state.snackbar = {
        msg,
        visible: true
      };
    },

    setTitle(state, title) {
      state.title = title;
    },
    clearTitle(state) {
      state.title = appName;
    },

    setSearchCallback(state, callback) {
      state.searchCallback = callback;
    },
    clearSearchCallback(state, clear) {
      state.searchCallback = null;
    }
  }
});

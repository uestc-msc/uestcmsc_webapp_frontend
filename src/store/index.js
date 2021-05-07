import Vue from 'vue';
import Vuex from 'vuex';
import {appName, DEBUG, sleep} from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: DEBUG,
  state: {
    // 当前登录用户信息
    // TODO: pathify
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
    // 对于支持搜索的页面，将输入搜索关键字的回调函数设为 searchCallback
    // 即可调用 appbar 的搜索组件
    searchCallback: null,
    searchKeyword: '',
    // appbar 下的 Loading 滚动条
    appbarLoading: false,
  },

  getters: {
    isAuthenticated: state => state.profile.id > 0,
    isNotAuthenticated: (state, getters) => !getters.isAuthenticated,
    isAdmin: state => state.profile.is_staff || state.profile.is_superuser,
    isSuperuser: state => state.profile.is_superuser,
    isSelf: state => (id) => state.profile.id === id,
    isSelfOrAdmin: (state, getters) => (id) => (getters.isAdmin || getters.isSelf(id)),
  },

  mutations: {
    setProfile(state, profile) {
      Vue.set(state, 'profile', profile);
    },
    clearProfile(state) {
      // state.profile = {"id": -1};
      Vue.set(state, 'profile', {id: -1});
    },

    setMsg(state, msg) {
      // 如果 state.snackbar.visible === true，直接修改 msg 不会触发 snackbar
      // 在一个同步函数里改为 false 后改为 true 也不会触发
      // 又不想把这一个 mutation 改为 action
      // 就只能用这种奇淫技巧了
      if (state.snackbar.visible) {
        state.snackbar.visible = false;
        sleep(10).then(() => {
          this.commit('setMsg');
        })
      } else {
        state.snackbar = {
          msg,
          visible: true
        };
      }
    },
    clearMsg(state) {
      state.snackbar.visible = false;
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
    clearSearchCallback(state) {
      state.searchCallback = null;
    },
    setSearchKeyword(state, value) {
      state.searchKeyword = value;
      state.searchCallback();
    },

    setAppbarLoading(state, bool) {
      state.appbarLoading = bool;
    }
  }
});

/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { User } from "@/types";

interface AccountState {
  token: string,
  profile: User
};

let state: AccountState = {
  token: localStorage.getItem('USER_TOKEN') || '',
  profile: {}
};

const getters = {
  isAuthenticated: (s: AccountState) => !!s.token,
};

const mutations = {
  set(s: AccountState, profile: User) {
    s.profile = profile;
  },
  clear(s: AccountState) {
    s.token = '';
    s.profile = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};

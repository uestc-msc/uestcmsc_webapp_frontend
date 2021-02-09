/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { User } from "@/types";
import Cookies from "js-cookie";

export interface AccountState {
  sessionid: string,
  profile: User
};

let state: AccountState = {
  sessionid: localStorage.getItem('sessionid') || '',
  profile: {}
};

const getters = {

  isAuthenticated: (s: AccountState) => !!s.sessionid,
};

const mutations = {
  save(oldState: AccountState, profile: User) {
    oldState.profile = profile;
    let sessionid: string = Cookies.get('sessionid') || '';
    oldState.sessionid = sessionid;
    localStorage.setItem('sessionid', sessionid)
  },
  clear(s: AccountState) {
    s.sessionid = '';
    s.profile = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};

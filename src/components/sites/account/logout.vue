<template/>

<script>
import Vue from 'vue'

import {goBack} from '@/utils/router';
import {logout} from "@/api/account";

export default Vue.extend({
  activated() {
    this.$store.commit('setAppbarLoading', true);
    let that = this;
    logout()
      .then(res => {
        that.$store.commit('setMsg', '再会~');
      })
      .catch(res => {
        that.$store.commit('setMsg', '登出失败，请清除 cookie 后登录，或联系管理员 :(');
      })
      .finally(() => {
        that.$store.commit('clearProfile');
        that.$store.commit('setAppbarLoading', false);
        goBack();
      });
  },
});
</script>

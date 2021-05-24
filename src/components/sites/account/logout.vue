<template/>

<script>
import Vue from 'vue'
import {goBack} from '@/utils/router';
import {logoutUser} from "@/api/account";

export default Vue.extend({
  activated() {
    this.$store.commit('setAppbarLoading', true);
    let that = this;
    logoutUser()
      .then(res => {
        that.$store.commit('setMsg', '再会~');
      })
      .catch(res => {
        that.$store.commit('setMsg', res.data);
      })
      .finally(() => {
        that.$store.commit('setAppbarLoading', false);
        goBack();
      });
  },
});
</script>

<template/>

<script>
import Vue from 'vue'

import axios from '@/utils/axios';
import {goBack, goHome} from '@/utils/router';
import {logout} from "@/api/account";

export default Vue.extend({
  activated() {
    this.$store.commit('setAppbarLoading', true);
    let that = this;
    logout()
      .finally(() => {
        that.$store.commit('setMsg', '再会~');
        that.$store.commit('clearProfile');
        that.$store.commit('setAppbarLoading', false);
        goBack();
      });
  },
});
</script>

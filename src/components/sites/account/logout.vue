<template/>

<script>
import Vue from 'vue'

import axios from '@/utils/axios';
import {goBack, goHome} from '@/utils/router';

export default Vue.extend({
  activated() {
    this.$store.commit('setAppbarLoading', true);
    let that = this;
    axios.post('/accounts/logout/').finally(() => {
      that.$store.commit('clearProfile');
      that.$store.commit('setAppbarLoading', false);
      goBack();
    });
  },
});
</script>

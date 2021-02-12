<template/>

<script>
import Vue from 'vue'

import axios from '@/utils/axios';
import {goBack, goHome} from '@/utils/router';

export default Vue.extend({
  activated() {
    axios.post('/accounts/logout/').then(() => {
      this.$store.commit('clearProfile');
      goBack();
    });
  },
});
</script>

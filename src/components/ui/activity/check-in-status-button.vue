<template>
  <v-btn
    class="check-in-status-button"
    :color="status.color"
    :loading="status.text === ''"
    @click="gotoCheckIn"
  >
    <v-icon class="mr-1">{{status.icon}}</v-icon>
    {{status.text}}
  </v-btn>
</template>

<style scoped>
.check-in-status-button {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>

<script>
import moment from "@/utils/moment";
import {QRCodeScanUrl} from "@/utils";

export default {
  props: {
    activity: {
      required: true
    }
  },

  data: () => ({
    status: {text: '', icon: '', color: 'primary'}
  }),

  methods: {
    gotoCheckIn() {
      if (this.status.text === '签到中')
        window.open(QRCodeScanUrl);
    },

    getCheckInStatus() {
      if (!this.activity)
        return {text: '', icon: '', color: 'primary'};
      if (this.$store.getters.isInList(this.activity.attender))
        return {text: '已签到', icon: 'mdi-check', color: 'success'};
      const currentDate = moment().dateNumber();
      const activityDate = moment(this.activity.datetime).dateNumber();
      if (activityDate > currentDate)
        return {text: '未开始', icon: 'mdi-alarm', color: 'primary'};
      if (activityDate < currentDate || !this.activity.check_in_open)
        return {text: '已结束', icon: 'mdi-alarm', color: 'primary'};
      return {text: '签到中', icon: 'mdi-bell-alert', color: 'warning'};
    }
  },

  watch: {
    activity() {
      this.status = this.getCheckInStatus();
    }
  },

  created() {
    this.status = this.getCheckInStatus();
  }
}
</script>
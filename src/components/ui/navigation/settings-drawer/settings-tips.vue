<template>
  <div class="bottom-tips" v-text="dailyTips"/>
</template>

<script>
import moment from "@/utils/moment";

export default {
  data: () => ({
    tips: [
      `阮薇薇 ${new Date().getFullYear() - 2019} 岁啦~`,
      '据说不使用梯子反而会变快喔',
    ],
    dailyTips: '',
  }),

  created() {
    let index = moment().dayOfYear() % this.tips.length;
    this.dailyTips = this.tips[index];
  }
}
</script>
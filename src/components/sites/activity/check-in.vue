<template>
  <div>
    <ActivityDetail/>
    <v-dialog v-model="showDialog" persistent :width="width">
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          签到中
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ActivityDetail from "@/components/sites/activity/detail";
import {checkInActivity} from '@/api/activity'

export default {
  components: {ActivityDetail},
  data() {
    return {
      showDialog: true
    };
  },

  computed: {
    screenWidth() {
      return this.$vuetify.breakpoint.width;
    },
    mobile() {
      return this.$vuetify.breakpoint.xs;
    },
    width() {
      return this.mobile ? this.screenWidth : this.screenWidth / 2;
    },
  },

  activated() {
    this.showDialog = true;
    const activityId = this.$route.params.activityId;
    const check_in_code = this.$route.params.checkInCode;
    let that = this;
    checkInActivity(activityId, {check_in_code})
      .then(res => {
        that.$store.commit('setMsg', res.data.detail);
      })
      .catch(response => {
        console.warn(response);
        that.$store.commit('setMsg', response.data);
      })
      .finally(() => {
        that.$router.push({
          name: 'ActivityDetail',
          params: {activityId}
        });
        that.showDialog = false;
      })
  }
}
</script>
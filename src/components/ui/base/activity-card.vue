<!--  activity card  -->
<template>
  <v-card
    @click="gotoActivityDetail"
  >
    <v-img
      height="250"
      :src="topPhotoUrl"
    >
      <v-card-title class="activity-title">{{activity.title}}</v-card-title>
    </v-img>

    <v-card-text>
      <div class="subtitle-1">
        {{formattedTime}}
      </div>
      <div class="subtitle-1">
        {{activity.location}}
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <PeopleChipGroup :users="activity.presenter"/>
    </v-card-text>

  </v-card>
</template>

<style>
.activity-title {
  color: rgb(250, 250, 250);
  text-shadow: rgb(68, 68, 68) 1px 1px 8px;
  font-size: 32px;
  line-height: 40px;
  position: absolute;
  bottom: 0;
}
</style>

<script>
import {getUserDetail} from "@/api/user";
import PeopleChipGroup from "@/components/ui/base/people-chip-group";

export default {
  components: {PeopleChipGroup},
  props: {
    activity: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      topPhotoUrl: null,
    };
  },
  computed: {
    formattedTime() {
      return this.activity.time;
    }
  },

  methods: {
    gotoActivityDetail() {
      this.$router.push({
        name: 'ActivityDetail',
        params: {
          activityDetail: activity,
          activityId: activity.id
        }
      })
    }
  },
  activated() {
    const randomPhotoSize = 19;
    const randomPhotoIndex = Math.floor(Math.random() * 19) + 1;
    this.topPhotoUrl = `/img/random/material-${randomPhotoIndex}.png`;
  }
}
</script>
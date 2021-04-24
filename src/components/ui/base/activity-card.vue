<!--  activity card  -->
<template>
  <v-card class="mx-auto my-12">
    <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    >
      <v-card-title class="activity-title">你好，阮薇薇！</v-card-title>
    </v-img>

    <v-card-text>
      <div class="subtitle-1">
        2021 年 5 月 1 日 20:00
      </div>
      <div class="subtitle-1">
        品 A403
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-text>
      <v-chip-group column>
        <PeopleChip
          v-for="user in users"
          :key="user.id"
          :user="user"
        />
      </v-chip-group>
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
import PeopleChip from "@/components/ui/base/people-chip";
import {getUserDetail} from "@/api/user";

export default {
  components: {PeopleChip},
  data() {
    return {
      users: []
    }
  },

  created() {
    let that = this;
    window.card = that;
    [9, 14, 15, 16, 17, 119].forEach(i => {
      getUserDetail(i).then(response => {
        that.users.push(response.data);
      })
    })
  },

  methods: {}
}
</script>
<!--  activity card  -->
<template>
  <v-card
    @click="gotoActivityDetail"
  >
    <v-img
      height="240"
      :src="activity.bannerUrl"
    >
      <template v-slot:placeholder>
        <PicturePlaceholderAlt/>
      </template>
      <v-card-title class="activity-card-title">{{ activity.title }}</v-card-title>
      <CheckInStatusButton :activity="activity"/>
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

    <v-card-text class="presenter-list-area">
      <PeopleChipGroup :user-id="activity.presenter"/>
    </v-card-text>

  </v-card>
</template>

<script>
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import moment from "@/utils/moment";
import {generateTopPhoto} from "@/utils/activity";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import CheckInStatusButton from "@/components/ui/activity/check-in-status-button";

export default {
  components: {CheckInStatusButton, PicturePlaceholderAlt, PicturePlaceholder, PeopleChipGroup},
  props: {
    activity: {
      type: Object,
      required: true
    }
  },

  data() {
    return {};
  },
  computed: {
    formattedTime() {
      return moment(this.activity.datetime).toChinese();
    }
  },

  methods: {
    gotoActivityDetail() {
      this.$router.push({
        name: 'ActivityDetail',
        params: {
          activity: this.activity,
          activityId: this.activity.id
        }
      })
    },
    generateTopPhoto() {
      generateTopPhoto(this.activity);
    }
  },

  created() {
    this.generateTopPhoto();
  },
  updated() {
    this.generateTopPhoto();
  }
}
</script>
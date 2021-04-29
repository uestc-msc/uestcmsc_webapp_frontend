<!--  activity card  -->
<template>
  <v-card
    @click="gotoActivityDetail"
  >
    <v-img
      height="250"
      :src="activity.topPhotoUrl"
    >
      <template v-slot:placeholder>
        <v-container>
          <PicturePlaceholder size="24" width="3"/>
        </v-container>
      </template>
      <v-card-title class="activity-card-title">{{ activity.title }}</v-card-title>
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
      <PeopleChipGroup :users="activity.presenter"/>
    </v-card-text>

  </v-card>
</template>

<script>
import './activity-card.css';
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import moment from "@/utils/moment";
import {generateTopPhoto} from "@/utils/activity";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

export default {
  components: {PicturePlaceholder, PeopleChipGroup},
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
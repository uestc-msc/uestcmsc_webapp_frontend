<template>
  <div>
    <PageErrorAlert v-if="error">
      {{ error }}
    </PageErrorAlert>
    <SimpleCard
      v-else-if="activity"
      md="10"
    >
      <template v-slot:before-card-text>
        <v-parallax
          height="300"
          :src="activity.topPhotoUrl"
        >
          <v-card-title class="activity-card-title">{{activity.title}}</v-card-title>
        </v-parallax>
      </template>

      <v-list two-line>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <PeopleChipGroup
                listitem
                :users="activity.presenter"
              />
            </v-list-item-title>
            <v-list-item-subtitle>主讲人</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">{{ clockIcon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ formattedTime }}</v-list-item-title>
            <v-list-item-subtitle>时间</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-map-marker</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ activity.location }}</v-list-item-title>
            <v-list-item-subtitle>地点</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-file</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ activity.location }}</v-list-item-title>
            <v-list-item-subtitle>文件</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-link</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title><a href="https://space.bilibili.com/456910030/">https://space.bilibili.com/456910030/</a></v-list-item-title>
            <v-list-item-subtitle>链接</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <PeopleChipGroup
                listitem
                :users="activity.attender"
              />
            </v-list-item-title>
            <v-list-item-subtitle>参与者（共 {{activity.attender.length}} 人）</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-image</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title><a href="https://space.bilibili.com/456910030/">https://space.bilibili.com/456910030/</a></v-list-item-title>
            <v-list-item-subtitle>相册</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </SimpleCard>

    <FloatingActionButton
      v-if="isPresenterOrAdmin"
      icon="mdi-pencil"
      color="primary"
      tooltip="编辑"
      @click="gotoActivityDetailEdit"
    />
  </div>
</template>


<script>
import '/public/static/css/activity-card.css';
import moment from '@/utils/moment'
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import PageErrorAlert from "@/components/ui/base/page-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import {isEmail} from "@/utils/validators";
import {mapGetters} from 'vuex'
import {getActivityDetail} from "@/api/activity";
import {generateTopPhoto} from "@/utils/activity";
import PeopleChipGroup from "@/components/ui/base/people-chip-group";

export default {
  components: {
    PeopleChipGroup,
    AdminIcon,
    PageErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    return {
      activityId: 0,
      activity: null,
      error: false,
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    isPresenterOrAdmin() {
      // TODO: 测试正确性
      return this.isAdmin ||
        this.activity && this.activity.presenter.find(function(user) {
          return user.id === this.$store.state.profile.id;
        })
    },

    clockIcon() {
      const hourEnglish = [
        'twelve', 'one', 'two', 'three',
        'four', 'five', 'six', 'seven',
        'eight', 'nine', 'ten', 'eleven'];
      let hour = moment(this.activity.datetime).hour();
      return `mdi-clock-time-${hourEnglish[hour % 12]}`;
    },
    formattedTime() {
      return moment(this.activity.datetime).toChinese();
    }
  },

  methods: {
    gotoActivityDetailEdit() {
      this.$router.push({
        name: 'ActivityDetailEdit', params: {
          userId: this.activity.id,
          activity: this.activity
        }
      });
    }
  },

  activated() {
    window.activity = this;
    this.activity = this.$route.params.activity;
    this.$store.commit('setAppbarLoading', true);
    this.activityId = this.$route.params.activityId;
    let that = this;
    getActivityDetail(this.activityId)
      .then(response => {
        that.activity = response.data;
        generateTopPhoto(this.activity);
      })
      .catch(response => {
        that.error = response.data;
      })
      .finally(() => {
        that.$store.commit('setAppbarLoading', false)
      })
  }
};
</script>
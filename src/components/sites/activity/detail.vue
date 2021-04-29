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

        <template v-if="activity.file.length">
          <v-list-item
            v-for="(file, index) in activity.file"
            :key="file.id"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ index === 0 ? "mdi-file" : "" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ file.filename }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatBytes(file.size) }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                text
                icon
                @click="downloadFile(file.download_link)"
              >
                <v-icon color="primary">mdi-download</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset></v-divider>
        </template>

        <template v-if="activity.link.length">
          <v-list-item
            v-for="(link, index) in activity.link"
            :key="link.id"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ index === 0 ? "mdi-link" : "" }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="link.url">{{ link.url }}</a>
              </v-list-item-title>
              <v-list-item-subtitle>{{ index === 0 ? '链接' : '' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
        </template>

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

          <v-container>
            <v-row
              v-for="r in [0, 3, 6]"
              :key="r"
            >
              <v-col
                v-for="n in [r, r+1, r+2]"
                :key="n"
                cols="4"
              >
                <v-img
                  :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <PicturePlaceholder size="64"/>
                    </template>
                </v-img>
              </v-col>
            </v-row>
          </v-container>

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
import '@/components/ui/activity/activity-card.css';
import moment from '@/utils/moment'
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import PageErrorAlert from "@/components/ui/base/page-error-alert";
import AdminIcon from "@/components/ui/user/admin-icon";
import {mapGetters} from 'vuex'
import {getActivityDetail} from "@/api/activity";
import {generateTopPhoto} from "@/utils/activity";
import PeopleChipGroup from "@/components/ui/user/people-chip-group";
import {downloadFile, formatBytes} from "@/utils/file";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

export default {
  components: {
    PicturePlaceholder,
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
      formatBytes,
      downloadFile,
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
        var file = {
          "id": "string",
          "activity_id": "string",
          "filename": "string",
          "size": 23333,
          "thumbnail": "/img/ruanweiwei.jpg",
          "download_link": "/img/ruanweiwei.jpg",
          "uploader": {
            "id": 0,
            "first_name": "string",
            "last_name": "string",
            "is_staff": true,
            "is_superuser": true,
            "avatar_url": "string"
          }
        };
        var link = {
          "id": 0,
          "url": "https://space.bilibili.com/456910030/"
        };
        that.activity.file = [file, file, file];
        that.activity.photo = [file, file];
        that.activity.link = [link, link];
        console.log(that.activity);
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
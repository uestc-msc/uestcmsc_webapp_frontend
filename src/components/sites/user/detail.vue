<template>
  <div>
    <PageErrorAlert v-if="error">
      {{ error }}
    </PageErrorAlert>
    <SimpleCard
      v-else-if="userProfile"
      md="6"
    >

      <v-container>
        <v-row>
          <v-col cols="4">
            <v-card>
              <v-img :src="userProfile.avatar_url"/>
            </v-card>
          </v-col>

          <v-col>
            <v-card-title class="display-1 justify-end pt-16">
              {{ userProfile.first_name }}
            </v-card-title>

            <v-card-subtitle class="text-right">
              {{ userProfile.last_name }}
              <AdminIcon :user="userProfile" size="24px"/>
            </v-card-subtitle>

            <v-card-text class="text-right">
              {{ userProfile.about }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>

      <v-list two-line>

        <v-list-item v-if="email">
          <v-list-item-icon>
            <v-icon color="primary">mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ email }}</v-list-item-title>
            <v-list-item-subtitle>邮箱</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-school</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="isAdmin">
            <v-list-item-title>{{ userProfile.student_id }}</v-list-item-title>
            <v-list-item-subtitle>学号</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title>{{ userProfile.student_id.substr(0, 4) }} 年</v-list-item-title>
            <v-list-item-subtitle>入学年份</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-calendar-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ last_login }}</v-list-item-title>
            <v-list-item-subtitle>上次登录</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-calendar-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ date_joined }}</v-list-item-title>
            <v-list-item-subtitle>注册时间</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">mdi-star-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ userProfile.experience }}</v-list-item-title>
            <v-list-item-subtitle>经验</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </SimpleCard>
    <FloatingActionButton
      v-if="isOwnerOrAdmin"
      icon="mdi-pencil"
      color="primary"
      tooltip="编辑"
      @click="gotoUserDetailEdit"
    />
  </div>
</template>


<script>
import moment from '@/utils/moment'
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import PageErrorAlert from "@/components/ui/base/page-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import {isEmail} from "@/utils/validators";
import {mapGetters} from 'vuex'
import {getUserDetail} from "@/api/user";

export default {
  components: {
    AdminIcon,
    PageErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    return {
      userId: 0,
      userProfile: null,
      error: false,
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
    isOwnerOrAdmin() {
      return this.$store.getters.isOwnerOrAdmin(this.userId)
    },
    email() {
      if (isEmail(this.userProfile.username))
        return this.userProfile.username;
      else
        return null;
    },
    last_login() {
      if (typeof (this.userProfile.last_login) == 'string' && this.userProfile.last_login.length)
        return moment(this.userProfile.last_login).fromNow();
      else
        return '暂无记录';
    },
    date_joined() {
      if (typeof (this.userProfile.date_joined) == 'string' && this.userProfile.date_joined.length)
        return moment(this.userProfile.date_joined).fromNow();
      else
        return '暂无记录';
    }
  },

  methods: {
    gotoUserDetailEdit() {
      this.$router.push({
        name: 'UserDetailEdit', params: {
          userId: this.userId,
          userProfile: this.userProfile
        }
      });
    }
  },

  activated() {
    this.userProfile = this.$route.params.userProfile;
    this.$store.commit('setAppbarLoading', true);
    this.userId = this.$route.params.userId;
    let that = this;
    getUserDetail(this.userId)
      .then(response => {
        that.userProfile = response.data;
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
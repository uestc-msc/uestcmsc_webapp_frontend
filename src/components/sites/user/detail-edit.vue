<template>
  <SimpleCard
    md="6"
    v-if="userProfile"
  >
    <v-form
      @submit.prevent="submit"
      ref="form"
      v-model="valid"
    >
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-card>
              <v-img :src="userProfile.avatar_url"/>
            </v-card>
            我们使用了 Gravatar API。Gravatar 是一项用于提供在全球范围内使用的头像服务。
            您只需按照<a href="https://cn.gravatar.com/support/activating-your-account/">教程</a>，在 Gravatar
            服务器上上传自己的头像，此处的头像就会更新。
          </v-col>

          <v-col>
            <v-container>
              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="userProfile.first_name"
                    :rules="firstNameRules"
                    :disabled="submitting"
                    label="姓名 *"
                    prepend-icon="mdi-account"
                    required
                  />
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="userProfile.last_name"
                    :disabled="submitting"
                    label="称号"
                    prepend-icon="mdi-alpha-t-circle"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="userProfile.student_id"
                    :rules="studentIdRules"
                    :disabled="submitting"
                    type="number"
                    label="学号 *"
                    prepend-icon="mdi-school"
                    required/>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <v-textarea
                    label="自我介绍"
                    :disabled="submitting"
                    :rules="aboutRules"
                    auto-grow
                    counter
                    v-model="userProfile.about"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>

        <v-row
          no-gutters
          align="center"
        >
          <v-col cols="4">
            <v-btn
              v-if="canChangePassword"
              color="warning"
              @click="gotoChangePassword"
            >
              修改密码
            </v-btn>
          </v-col>

          <v-col>
            <v-switch
              label="订阅邮件推送"
              v-model="userProfile.subscribe_email"
            />
          </v-col>

          <v-spacer/>

          <v-col>
            <v-btn
              :disabled="!valid"
              :loading="submitting"
              :color="submitColor"
              width="100px"
              @click="submit"
            >
              <v-icon v-if="success">
                mdi-check
              </v-icon>
              <template v-else>
                更新信息
              </template>
            </v-btn>
          </v-col>
        </v-row>

        <FormErrorAlert
          v-if="error"
          :msg="error"
        />
      </v-container>
    </v-form>

  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import axios from "@/utils/axios";
import ErrorAlert from "@/components/ui/base/component-error-alert";
import AdminIcon from "@/components/ui/base/admin-icon";
import FormErrorAlert from "@/components/ui/base/form-error-alert";
import {inputRules} from "@/utils/validators";
import {hasGreaterPermissions} from "@/utils/permissions";

export default {
  components: {
    FormErrorAlert,
    AdminIcon,
    ErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    return {
      userId: 0,
      userProfile: null,
      valid: false,
      submitting: false,
      success: false,
      error: false,

      firstNameRules: inputRules.user.firstNameRules,
      studentIdRules: inputRules.user.studentIdRules,
      aboutRules: inputRules.user.aboutRules
    }
  },

  computed: {
    submitColor() {
      if (this.error)
        return 'error';
      else if (this.success)
        return 'success';
      else
        return 'primary';
    },
    canChangePassword() {
      return (this.$store.state.profile.id === this.userId) ||
        hasGreaterPermissions(this.$store.state.profile, this.userProfile);
    }
  },

  activated() {
    window.onbeforeunload = () => '系统可能不会保存您所做的更改。'

    this.userProfile = this.$route.params.userProfile;
    this.$store.commit('setAppbarLoading', true);
    this.userId = this.$route.params.userId;
    let that = this;
    axios.get(`/users/${this.userId}/`)
      .then(response => {
        that.userProfile = response.data;
      })
      .catch(response => {
        that.error = response.data;
      })
      .finally(() => {
        that.$store.commit('setAppbarLoading', false)
      })
  },

  deactivated() {
    window.onbeforeunload = null;
  },

  methods: {
    gotoChangePassword() {
      this.$router.push({
        name: 'ChangePassword', params: {
          userId: this.userId,
        }
      });
    },

    submit() {
      this.valid = this.$refs.form.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.error = null;
      let {first_name, last_name, student_id, about, subscribe_email} = this.userProfile;
      let data = {first_name, last_name, student_id, about, subscribe_email};
      let that = this;
      axios.patch(`/users/${that.userId}/`, data)
        .then((response) => {
          that.success = true;
          setTimeout(() => {
            that.success = false;
          }, 1500);
        })
        .catch(response => {
          let detail = response.data;
          if (typeof (detail) == 'string')
            that.error = detail;
          else if (typeof (detail) == 'object')
            that.error = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    }
  },

};
</script>
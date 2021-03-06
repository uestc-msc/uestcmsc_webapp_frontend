<template>
  <SimpleCard
    v-if="userProfile"
  >
    <v-container>
      <!--    个人信息修改部分    -->
      <v-form
        ref="form"
        v-model="formValid"
      >
        <v-row>
          <v-col cols="4" >
            <v-row justify="center">
              <v-card>
                <v-responsive aspect-ratio="1" width="200px">
                  <v-img
                    :src="userProfile.avatar_url"
                    aspect-ratio="1"
                  >
                    <template v-slot:placeholder>
                      <PicturePlaceholderAlt/>
                    </template>
                  </v-img>
                </v-responsive>
              </v-card>
            </v-row>
            <v-row>
              <div class="my-2">
            我们使用了 Gravatar API。Gravatar 是一项用于提供在全球范围内使用的头像服务。
            您只需按照<a href="https://cn.gravatar.com/support/activating-your-account/" target="_blank">教程</a>，在 Gravatar
            服务器上上传自己的头像，此处的头像就会更新。
                </div>
            </v-row>
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
                    label="头衔"
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

        <v-row align="center">
          <v-col
            v-if="canChangePassword"
            cols="4"
          >
            <v-row justify="center">
              <PasswordEditDialog
                :user="userProfile"
              >
                <template v-slot:activator="{on, attrs}">
                  <v-btn
                    color="warning"
                    v-bind="attrs"
                    v-on="on"
                  >
                    修改密码
                  </v-btn>
                </template>
              </PasswordEditDialog>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row justify="center">
              <v-switch
                label="订阅邮件推送"
                v-model="userProfile.subscribe_email"
                :disabled="submitting"
              />
            </v-row>
          </v-col>

          <v-col cols="4">
            <v-row justify="center">
              <v-fade-transition hide-on-leave>
                <v-btn
                  v-if="!success"
                  :disabled="!formValid"
                  :loading="submitting"
                  :color="errorMsg ? 'error' : 'primary'"
                  @click="submit"
                >
                  更新信息
                </v-btn>
                <v-btn v-else color="success">
                  <v-icon v-if="success">
                    mdi-check
                  </v-icon>
                </v-btn>
              </v-fade-transition>
            </v-row>
          </v-col>
        </v-row>

        <ErrorAlert
          as-row
          v-if="errorMsg"
          :msg="errorMsg"
        />
      </v-form>
    </v-container>
  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/button/floating-action-button";
import AdminIcon from "@/components/ui/user/admin-icon";
import {inputRules} from "@/utils/validators";
import {hasGreaterPermissions, isSelfOrAdminOrGoHome} from "@/utils/permissions";
import {getUserDetail, updateUserDetail} from "@/api/user";
import {DEBUG, displaySuccessTime, lazyAvatarUrl, sleep} from "@/utils";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
import PasswordEditDialog from "@/components/sites/user/password-edit-dialog";
import PicturePlaceholderAlt from "@/components/ui/base/picture-placeholder-alt";
import ErrorAlert from "@/components/ui/base/error-alert";

export default {
  components: {
    ErrorAlert,
    PicturePlaceholderAlt,
    PasswordEditDialog,
    PicturePlaceholder,
    AdminIcon,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    let that = this;
    return {
      userProfile: {
        student_id: '',
        about: ''
      },
      lazyAvatar: lazyAvatarUrl,

      formValid: false,
      submitting: false,
      success: false,
      errorMsg: false,

      firstNameRules: inputRules.user.firstNameRules,
      studentIdRules: inputRules.user.studentIdRules,
      aboutRules: inputRules.user.aboutRules,
    }
  },

  computed: {
    userId() {
      return this.$route.params.userId;
    },
    hasGreaterPermissions() {
      return hasGreaterPermissions(this.$store.state.profile, this.userProfile);
    },
    isSelf() {
      return this.$store.getters.isSelf(this.userId);
    },
    canChangePassword() {
      return this.hasGreaterPermissions || this.isSelf;
    },
  },

  activated() {
    if (!isSelfOrAdminOrGoHome(this.userId))
      return;

    if (!DEBUG)
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'

    this.userProfile = this.$route.params.userProfile;
    this.$store.commit('setAppbarLoading', true);
    let that = this;
    getUserDetail(this.userId)
      .then(response => {
        that.userProfile = response.data;
      })
      .catch(response => {
        console.warn(response);
        that.error = response.data;
      })
      .finally(() => {
        that.$store.commit('setAppbarLoading', false)
      })
    this.submitting = false;
    this.success = false;
    this.errorMsg = false;
    this.showChangePasswordDialog = false;
  },

  deactivated() {
    window.onbeforeunload = null;
  },

  methods: {
    submit() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.success = false;
      this.errorMsg = null;

      let {first_name, last_name, student_id, about, subscribe_email} = this.userProfile;
      let data = {first_name, last_name, student_id, about, subscribe_email};
      let that = this;
      updateUserDetail(that.userId, data)
        .then(async (response) => {
          that.userProfile = response.data;
          that.success = true;
          await sleep(displaySuccessTime);
          that.success = false;
        })
        .catch(response => {
          let detail = response.data;
          if (typeof (detail) == 'string')
            that.errorMsg = detail;
          else if (typeof (detail) == 'object')
            that.errorMsg = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
};
</script>
<template>
  <SimpleCard
    v-if="userProfile"
  >
    <v-container>
      <!--    个人信息修改部分    -->
      <v-form
        @submit.prevent="submit"
        ref="form"
        v-model="formValid"
      >
        <v-row>
          <v-col cols="4" >
            <v-row justify="center">
            <v-card width="200px">
              <!--  这种大头像还是别开 lazy-src=默认头像了，不然差别太大  -->
              <!--  用滚圈圈作为占位符还是挺不错  -->
              <v-img
                :src="userProfile.avatar_url"
                width="200px"
              >
                <template v-slot:placeholder>
                    <PicturePlaceholder size="64"/>
                </template>
              </v-img>
            </v-card>
            </v-row>
            <v-row>
              <span>
            我们使用了 Gravatar API。Gravatar 是一项用于提供在全球范围内使用的头像服务。
            您只需按照<a href="https://cn.gravatar.com/support/activating-your-account/">教程</a>，在 Gravatar
            服务器上上传自己的头像，此处的头像就会更新。
                </span>
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

        <v-row align="center">
          <v-col cols="4">
            <v-row justify="center">
              <v-fade-transition>
                <v-btn
                  color="warning"
                  @click="showChangePasswordForm=!showChangePasswordForm"
                >
                  {{ showChangePasswordForm ? '不想改了' : '修改密码' }}
                </v-btn>
              </v-fade-transition>
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
              <v-btn
                :disabled="!formValid"
                :loading="submitting"
                :color="submitColor"
                @click="submit"
              >
                <v-icon v-if="success">
                  mdi-check
                </v-icon>
                <template v-else>
                  更新信息
                </template>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <FormErrorAlert
          v-if="error"
          :msg="error"
        />
      </v-form>

      <!--   下面是密码修改部分     -->
      <template
        v-if="showChangePasswordForm"
      >
        <v-scroll-y-reverse-transition>
          <v-form
            @submit.prevent="submitPassword"
            ref="passwordForm"
            v-model="passwordFormValid"
            key="1"
          >

            <v-row no-gutters>
              <v-col>
                <v-text-field
                  v-model="oldPassword"
                  :rules="passwordRules"
                  :disabled="passwordSubmitting"
                  :type="showOldPassword ? 'text' : 'password'"
                  :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showOldPassword = !showOldPassword"
                  counter
                  :label="isSelf ? '旧密码 *' : '您的密码 *'"
                  prepend-icon="mdi-form-textbox-password"
                  required/>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :disabled="passwordSubmitting"
                  :type="showNewPassword ? 'text' : 'password'"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showNewPassword = !showNewPassword"
                  @input="$refs.passwordConfirm.validate(true)"
                  counter
                  :label="isSelf ? '新密码 *' : '该用户的新密码 *'"
                  prepend-icon="mdi-lock"
                  required/>
                <!-- @input="$refs.passwordConfirm.validate(true)"  可以在输入密码时比对密码确认框  -->
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-text-field
                  v-model="passwordConfirm"
                  :rules="passwordConfirmRules"
                  :disabled="passwordSubmitting"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPasswordConfirm = !showPasswordConfirm"
                  counter
                  label="重复新密码 *"
                  prepend-icon="mdi-lock-check"
                  ref="passwordConfirm"
                  required/>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-btn
                  :disabled="!passwordFormValid"
                  :loading="passwordSubmitting"
                  :color="passwordSubmitColor"
                  block
                  @click="submitPassword"
                >
                  <v-icon v-if="passwordSuccess">
                    mdi-check
                  </v-icon>
                  <template v-else>
                    修改密码
                  </template>
                </v-btn>
              </v-col>
            </v-row>
            <FormErrorAlert
              v-if="passwordError"
              :msg="passwordError"
            />
          </v-form>
        </v-scroll-y-reverse-transition>
      </template>
    </v-container>

  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
import FloatingActionButton from "@/components/ui/base/floating-action-button";
import PageErrorAlert from "@/components/ui/base/page-error-alert";
import AdminIcon from "@/components/ui/user/admin-icon";
import FormErrorAlert from "@/components/ui/base/form-error-alert";
import {inputRules} from "@/utils/validators";
import {hasGreaterPermissions} from "@/utils/permissions";
import {changePassword, getUserDetail, updateUserDetail} from "@/api/user";
import md5 from "md5";
import {avatarDefault, displayCheckButtonTime} from "@/utils";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";

export default {
  components: {
    PicturePlaceholder,
    FormErrorAlert,
    AdminIcon,
    PageErrorAlert,
    FloatingActionButton,
    SimpleCard
  },

  data() {
    let that = this;
    return {
      userId: 0,
      userProfile: {
        student_id: '',
        about: ''
      },

      showChangePasswordForm: false,
      formValid: false,
      submitting: false,
      success: false,
      error: false,

      oldPassword: '',
      showOldPassword: false,
      password: '',
      showNewPassword: false,
      passwordConfirm: '',
      showPasswordConfirm: false,

      passwordFormValid: true,
      passwordSubmitting: false,
      passwordError: null,
      passwordSuccess: false,

      firstNameRules: inputRules.user.firstNameRules,
      studentIdRules: inputRules.user.studentIdRules,
      aboutRules: inputRules.user.aboutRules,
      passwordRules: inputRules.user.passwordRules,
      passwordConfirmRules: inputRules.user.passwordConfirmRules(that),
      avatarDefault,
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
    passwordSubmitColor() {
      if (this.passwordError)
        return 'error';
      else if (this.passwordSuccess)
        return 'success';
      else
        return 'primary';
    },

    hasGreaterPermissions() {
      return hasGreaterPermissions(this.$store.state.profile, this.userProfile);
    },
    isSelf() {
      return this.$store.state.profile.id === this.userId;
    },
    canChangePassword() {
      return this.hasGreaterPermissions || this.isSelf;
    },
  },

  activated() {
    // window.onbeforeunload = () => '系统可能不会保存您所做的更改。'

    this.userId = Number(this.$route.params.userId);
    this.userProfile = this.$route.params.userProfile;
    this.$store.commit('setAppbarLoading', true);
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
    this.submitting = false;
    this.success = false;
    this.error = false;
    this.showChangePasswordForm = false;
    this.passwordSubmitting = false;
    this.passwordSuccess = false;
    this.passwordError = false;
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
      this.error = null;

      let {first_name, last_name, student_id, about, subscribe_email} = this.userProfile;
      let data = {first_name, last_name, student_id, about, subscribe_email};
      let that = this;
      updateUserDetail(that.userId, data)
        .then((response) => {
          that.userProfile = response.data;
          that.success = true;
          setTimeout(() => {
            that.success = false;
          }, displayCheckButtonTime);
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
    },
    submitPassword() {
      this.passwordFormValid = this.$refs.form.validate();
      if (!this.passwordFormValid)
        return;

      this.passwordSubmitting = true;
      this.passwordSuccess = false;
      this.passwordError = null;

      let data = {
        old_password: md5(this.oldPassword),
        new_password: md5(this.password),
      };
      let that = this;
      changePassword(this.userProfile.id, data)
        .then(() => {
          if (that.isSelf) {
            that.$store.commit('setMsg', '修改成功！请重新登录~');
            that.$store.commit('clearProfile');
            that.$router.push('/login/');
          } else {
            that.$store.commit('setMsg', '修改成功！');
            that.passwordSuccess = true;
            setTimeout(() => {
              that.passwordSuccess = false;
            }, displayCheckButtonTime);
          }
        })
        .catch(response => {
          that.passwordError = response.data;
          if (response.status === 403)
            that.passwordError = "旧密码错误。";
        })
        .finally(() => {
          that.passwordSubmitting = false;
        });
    },
  },

};
</script>
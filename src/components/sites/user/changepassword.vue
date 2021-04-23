<template>
  <SimpleCard>
    <v-form
      @submit.prevent="changePassword"
      ref="form"
      v-model="formValid"
    >
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-if="hasLessPermission"
              v-model="old_password"
              :rules="passwordRules"
              :disabled="submitting"
              :type="show_old_password ? 'text' : 'password'"
              :append-icon="show_old_password ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show_old_password = !show_old_password"
              counter
              label="旧密码 *"
              prepend-icon="mdi-form-textbox-password"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :disabled="submitting"
              :type="show_new_password ? 'text' : 'password'"
              :append-icon="show_new_password ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show_new_password = !show_new_password"
              @input="$refs.passwordConfirm.validate(true)"
              counter
              label="新密码 *"
              prepend-icon="mdi-lock"
              required/>
            <!-- @input="$refs.passwordConfirm.validate(true)"  可以在输入密码时比对密码确认框  -->
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="password_confirm"
              :rules="passwordConfirmRules"
              :disabled="submitting"
              :type="show_password_confirm ? 'text' : 'password'"
              :append-icon="show_password_confirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show_password_confirm = !show_password_confirm"
              counter
              label="重复密码 *"
              prepend-icon="mdi-lock-check"
              ref="passwordConfirm"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-btn
              :disabled="!formValid"
              :loading="submitting"
              :color="submitColor"
              block
              @click="changePassword"
            >
              重置密码
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
import md5 from "md5";
import SimpleCard from "@/components/ui/base/simple-card";
import {inputRules} from "@/utils/validators";
import FormErrorAlert from "@/components/ui/base/form-error-alert";
import {hasGreaterPermissions} from "@/utils/permissions";
import {changePassword, getUserDetail} from "@/api/user";

export default {
  components: {FormErrorAlert, SimpleCard},
  data() {
    let that = this;
    return {
      token: '',
      old_password: '',
      show_old_password: false,
      password: '',
      show_new_password: false,
      password_confirm: '',
      show_password_confirm: false,

      passwordRules: inputRules.user.passwordRules,
      passwordConfirmRules: inputRules.user.passwordConfirmRules(that),

      userProfile: {},
      formValid: true,
      submitting: false,
      error: null,
      success: false,
    };
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
    // 登陆用户是否比当前页面的用户拥有更高权限
    hasLessPermission() {
      return !this.$store.state.profile ||
        !this.userProfile ||
        !hasGreaterPermissions(this.$store.state.profile, this.userProfile);
    },
  },

  activated() {
    let that = this;
    // 改标题
    this.$store.commit('setTitle', '修改密码');
    // 比较权限，如果登录用户权限大于当前用户，不需要输入旧密码
    this.userProfile = this.$route.params.userProfile;
    if (!this.userProfile || !this.userProfile.id) {
      getUserDetail(this.$route.params.userId)
        .then(response => {
          that.userProfile = response.data;
        })
    }
  },

  deactivated() {
    this.$store.commit('clearTitle');
  },

  methods: {
    changePassword() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.error = null;
      let data = {
        old_password: md5(this.old_password),
        new_password: md5(this.password),
      };
      let that = this;
      changePassword(this.userProfile.id)
        .then(() => {
          this.$store.commit('setMsg', '重置成功！请重新登录~');
          this.$store.commit('clearProfile');
          this.$router.push('/login/');
        })
        .catch(response => {
          that.error = response.data;
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
};
</script>

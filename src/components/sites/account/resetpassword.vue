<template>
  <SimpleCard>
    <v-form
      @submit.prevent="resetPassword"
      ref="form"
      v-model="formValid"
    >
      <v-container>
        <v-row no-gutters>
        <v-col>
          <v-text-field
            v-model="token"
            ref="token"
            disabled
            :loading="checkingToken"
            :rules="tokenRules"
            label="token"
            prepend-icon="mdi-lock-reset"
            required
          >
            <v-icon
              v-if="tokenValid && !checkingToken"
              slot="append"
              color="green"
            >
              mdi-check-circle
            </v-icon>
            <v-icon
              v-if="!tokenValid && !checkingToken"
              slot="append"
              color="red"
            >
              mdi-alert-circle
            </v-icon>
          </v-text-field>
        </v-col>
        </v-row>

        <v-row no-gutters>
        <v-col>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :disabled="submitting"
            :type="show_password ? 'text' : 'password'"
            :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show_password = !show_password"
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
            :color="this.errorMsg ? 'error' : 'primary'"
            block
            @click="resetPassword"
          >
            重置密码
          </v-btn>
        </v-col>
        </v-row>

        <ErrorAlert
          as-row
          v-if="errorMsg"
          :msg="errorMsg"
        />

      </v-container>
    </v-form>
  </SimpleCard>
</template>

<script>
import md5 from "md5";
import SimpleCard from "@/components/ui/base/simple-card";
import {inputRules} from "@/utils/validators";
import {resetPassword} from "@/api/account";
import ErrorAlert from "@/components/ui/base/error-alert";
import {isNotAuthenticatedOrGoHome} from "@/utils/permissions";

export default {
  components: {ErrorAlert, SimpleCard},
  data() {
    let that = this;
    return {
      token: '',
      password: '',
      show_password: false,
      password_confirm: '',
      show_password_confirm: false,

      tokenRules: [v => that.tokenValid || 'token 错误或已过期'],
      passwordRules: inputRules.user.passwordRules,
      passwordConfirmRules: inputRules.user.passwordConfirmRules(that),

      checkingToken: true,
      tokenValid: true,
      formValid: true,
      submitting: false,
      errorMsg: null,
    };
  },

  methods: {
    resetPassword() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.errorMsg = null;
      let data = {
        token: this.token,
        new_password: md5(this.password),
      }
      let that = this;
      resetPassword(data)
        .then(() => {
          this.$store.commit('setMsg', '重置成功！请重新登录~');
          this.$store.commit('clearProfile');
          this.$router.push({name: 'Login'});
        })
        .catch(response => {
          console.warn(response);
          let detail = response.data;
          this.errorMsg = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },

  activated() {
    if (!isNotAuthenticatedOrGoHome())
      return;

    let that = this;
    // 进入页面，填入 token 并验证有效性
    this.token = this.$route.query.token;
    resetPassword({token: that.token})
      .then(() => {
        that.tokenValid = true;
      })
      .catch(response => {
        console.warn(response);
        that.tokenValid = false;
      })
      .finally(() => {
        that.checkingToken = false;
        that.$refs.token.validate(true);
      });
  },

};
</script>

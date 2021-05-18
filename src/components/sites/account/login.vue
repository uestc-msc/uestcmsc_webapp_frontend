<template>
  <SimpleCard>
    <v-form
      @submit.prevent="login"
      ref="form"
      v-model="valid"
    >
      <!-- 内层的 container、col 是为了限制 form 的布局 -->
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :disabled="submitting"
              type="email"
              label="邮箱"
              prepend-icon="mdi-email"
              required
            />
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
              label="密码"
              prepend-icon="mdi-lock"
              required
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-btn
              :loading="submitting"
              :color="this.errorMsg ? 'error' : 'primary'"
              block
              type="submit"
            >
              登录
            </v-btn>
          </v-col>
        </v-row>

        <ErrorAlert
          as-row
          v-if="errorMsg"
          :msg="errorMsg"
        />

        <v-row no-gutters>
          <v-col class="d-flex justify-space-between">
            <v-btn
              plain
              color="primary"
              @click="router.push({ name: 'ForgetPassword' })"
            >
              忘记密码
            </v-btn>
            <v-btn
              plain
              color="primary"
              @click="router.push({ name: 'Signup' })"
            >
              注册
            </v-btn>
          </v-col>
        </v-row>


      </v-container>
    </v-form>
  </SimpleCard>
</template>

<script>
import Vue from 'vue'

import {goBack} from '@/utils/router';
import router from "@/router/index";
import md5 from "md5";
import {inputRules} from "@/utils/validators";
import SimpleCard from '@/components/ui/base/simple-card'
import Cookies from 'js-cookie';
import {login} from "@/api/account";
import ErrorAlert from "@/components/ui/base/error-alert";
import {isNotAuthenticatedOrGoHome} from "@/utils/permissions";

export default Vue.extend({
  components: {ErrorAlert, SimpleCard},
  data: () => ({
    valid: true,
    submitting: false,
    errorMsg: null,
    username: "",
    usernameRules: inputRules.user.usernameRules,
    password: "",
    passwordRules: inputRules.user.passwordRules,
    show_password: false,
    router,
  }),

  methods: {
    login() {
      this.valid = this.$refs.form.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.errorMsg = null;
      let that = this;
      let data = {
        username: this.username,
        password: md5(this.password)
      };
      login(data)
        .then((response) => {
          that.$store.commit('setProfile', response.data);
          // 如果前后端没有跨站就不需要手动管理 CSRFToken
          // Cookies.set('csrftoken', response.data.csrftoken, { expires: 364 });
          let first_name = response.data.first_name;
          that.$store.commit('setMsg', `欢迎回来，${first_name}~`)
          goBack();
        })
        .catch((response) => {
          console.warn(response);
          that.errorMsg = response.data;
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },

  activated() {
    isNotAuthenticatedOrGoHome();
  }
});
</script>

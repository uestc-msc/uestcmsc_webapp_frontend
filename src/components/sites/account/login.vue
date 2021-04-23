<template>
  <SimpleCard>
    <v-form
      @submit.prevent="login"
      ref="loginForm"
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
              :color="this.error ? 'error' : 'primary'"
              block
              type="submit"
            >
              登录
            </v-btn>
          </v-col>
        </v-row>

        <FormErrorAlert
          v-if="error"
          :msg="error"
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
              @click="router.push({ name: 'SignUp' })"
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
import FormErrorAlert from "@/components/ui/base/form-error-alert";
import Cookies from 'js-cookie';
import {login} from "@/api/account";

export default Vue.extend({
  components: {FormErrorAlert, SimpleCard},
  data: () => ({
    valid: true,
    submitting: false,
    error: null,
    username: "",
    usernameRules: inputRules.user.usernameRules,
    password: "",
    passwordRules: inputRules.user.passwordRules,
    show_password: false,
    router,
  }),

  methods: {
    login() {
      this.valid = this.$refs.loginForm.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.error = null;
      let that = this;
      let data = {
        username: this.username,
        password: md5(this.password)
      };
      login(data)
        .then((response) => {
          that.$store.commit('setProfile', response.data);
          Cookies.set('csrftoken', response.data.csrftoken);
          let first_name = response.data.first_name;
          that.$store.commit('setMsg', `欢迎回来，${first_name}~`)
          goBack();
        })
        .catch((response) => {
          that.error = response.data;
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
});
</script>

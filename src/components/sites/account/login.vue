<template>
  <SimpleCard>
    <v-form
      @submit.prevent="login"
      ref="loginForm"
      v-model="valid"
    >
      <!-- 内层的 container、col 是为了限制 form 的布局 -->
      <v-container>
        <v-col>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            type="email"
            label="邮箱"
            prepend-icon="mdi-email"
            required/>
        </v-col>

        <v-col>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="密码"
            prepend-icon="mdi-lock"
            required/>
        </v-col>

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

        <v-col v-if="error">
          <v-alert elevation="4" type="error">
            {{ error }}
          </v-alert>
        </v-col>

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
          >注册
          </v-btn
          >
        </v-col>

      </v-container>
    </v-form>
    </SimpleCard>
</template>

<script>
import Vue from 'vue'

import {goBack} from '@/utils/router';
import router from "@/router/index";
import axios from '@/utils/axios';
import md5 from "md5";
import {isEmail} from "@/utils/validate_input";
import SimpleCard from '@/components/ui/base/simple-card'

export default Vue.extend({
  components: {SimpleCard},
  data: () => ({
    valid: true,
    submitting: false,
    error: null,
    username: "",
    usernameRules: [v => !!v || '邮箱不能为空'],
    password: "",
    passwordRules: [v => !!v || '密码不能为空'],
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
      axios.post('/accounts/login/', data)
        .then((response) => {
          that.$store.commit('saveProfile', response.data)
          let first_name = response.data.first_name;
          that.$store.commit('postMsg', `欢迎回来，${first_name}~`)
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

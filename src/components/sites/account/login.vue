<template>
  <!-- 外层的 container、row、col 是为了限制 card 的布局 -->
  <v-container>
    <v-row class="justify-center">
      <v-col xs="12" md="8">
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="login">
              <!-- 内层的 container、col 是为了限制 form 的布局 -->
              <v-container>
                <v-col>
                  <v-text-field
                    v-model="email"
                    type="email"
                    label="邮箱"
                    prepend-icon="mdi-email"
                    required
                  />
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="password"
                    type="password"
                    label="密码"
                    prepend-icon="mdi-lock"
                    required
                  />
                </v-col>

                <v-col>
                  <v-btn
                    :loading="loading"
                    :color="login_button_color"
                    block
                    type="submit"
                  >
                    登录
                  </v-btn>
                </v-col>
                <v-col v-if="error">
                  <v-alert elevation="4" type="error">{{ error }}</v-alert>
                </v-col>
                <v-col class="d-flex justify-space-between">
                  <v-btn
                    plain
                    color="primary"
                    @click="router.push({ name: 'ForgetPassword' })"
                    >忘记密码？</v-btn
                  >
                  <v-btn
                    plain
                    color="primary"
                    @click="router.push({ name: 'SignUp' })"
                    >注册</v-btn
                  >
                </v-col>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { goBack } from '@/utils/router';
import router from "@/router/index";
import Store from "@/store/index";
import axios from '@/utils/axios';
import AccountState from "@/store/modules/account"

export default Vue.extend({
  data: () => ({
    loading: false,
    error: null,
    
    email: "",
    password: "",

    router,
  }),
  computed: {
    login_button_color: function () {
      return this.error ? "error" : "primary";
    },
  },
  methods: {
    login() {
      this.loading = true;
      this.error = null;
      let that = this;
      let data = {
        username: this.email,
        password: this.password
      };
      axios.post('/accounts/login/', data)
        .then((response) => {
          that.$store.commit('account/save', response.data)
          let first_name = response.data.first_name;
          that.$store.commit('snackbar/post', `欢迎回来，${first_name}~`)
          goBack();
        })
        .catch((error) => {
          that.error = error.reponse.detail;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>

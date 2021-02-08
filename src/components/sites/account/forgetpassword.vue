<template>
  <v-container>
    <v-layout justify-center>
      <v-flex
          xs12
          md8
      >
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-layout column>
                <v-flex>
                  <v-text-field
                      v-model="username"
                      :error-messages = "getErrorByDelegate( 'username' )"
                      label="邮箱"
                      prepend-icon = "mdi-email"
                      required />
                </v-flex>
                <v-flex>
                  <v-text-field
                      v-model="password"
                      :error-messages = "getErrorByDelegate( 'password' )"
                      type="password"
                      label="密码"
                      prepend-icon = "mdi-form-textbox-password"
                      required />
                </v-flex>
                <v-flex
                    class="text-xs-center"
                    mt-3>
                  <v-btn
                      :loading = "loading"
                      :color="login_button_color"
                      block
                      big
                      type="submit">
                    登录
                  </v-btn>
                </v-flex>
                <v-flex class="d-flex justify-space-between">
                  <a @click="signup">忘记密码？ </a>
                  <a @click="signup" style="text-align: right"> 注册</a>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { parseGraphqlError, getErrorMessage } from '@/utils';
// import { goBack } from '@/router/utils';
import Router from '@/router/index';
import Store from '@/store/index';

export default {
  metaInfo() { return { title: 'Login' }; },
  data: () => ({
    loading: false,
    error: null,
    username: '',
    password: '',
  }),
  computed: {
    login_button_color: function () {
      return this.error ? 'error' : 'primary';
    }
  },
  methods: {

    getErrorByDelegate(field) {
      return getErrorMessage(this.error, field);
    },

    login() {
      this.loading = true;
      this.error = null;
      const { username, password } = this;
      Store.dispatch('user/login', { username, password })
        .then(() => {
          // goBack();
        })
        .catch((error) => {
          this.error = parseGraphqlError(error);
        })
        .finally(() => { this.loading = false; });
    },

    signup() {
      Router.push({
        name: 'Signup',
      });
    },
  },
};
</script>

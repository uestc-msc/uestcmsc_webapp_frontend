<template>
  <v-container fluid>
    <v-row justify-center>
      <v-col
          xs12
          md8
      >
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-row column>
                <v-col>
                  <v-text-field
                      v-model="username"
                      :error-messages = "getErrorByDelegate( 'username' )"
                      label="邮箱"
                      prepend-icon = "mdi-email"
                      required />
                </v-col>
                <v-col>
                <v-text-field
                    v-model="password"
                    :error-messages = "getErrorByDelegate( 'password' )"
                    type="password"
                    label="密码 *"
                    prepend-icon = "mdi-lock"
                    required />
                </v-col>
                <v-col>
                  <v-text-field
                      v-model="passwordConfirm"
                      type="password"
                      label="重复密码 *"
                      prepend-icon = "mdi-lock-check"
                      required />
                </v-col>
                <v-col
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
                </v-col>
                <v-col class="d-flex justify-space-between">
                  <a @click="signup">忘记密码？ </a>
                  <a @click="signup" style="text-align: right"> 注册</a>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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

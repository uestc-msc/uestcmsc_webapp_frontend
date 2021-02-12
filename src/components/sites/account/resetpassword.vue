<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xs="12" md="8">
        <v-card>
          <v-card-text>
            <v-form
              @submit.prevent="resetPassword"
              ref="form"
              v-model="formValid"
            >
              <v-container>

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

                <v-col>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    type="password"
                    label="新密码 *"
                    prepend-icon="mdi-lock"
                    required/>
                </v-col>

                <v-col>
                  <v-text-field
                    v-model="passwordConfirm"
                    :rules="passwordConfirmRules"
                    type="password"
                    label="重复密码 *"
                    prepend-icon="mdi-lock-check"
                    required/>
                </v-col>

                <v-col>
                  <v-btn
                    :disabled="!formValid"
                    :loading="submitting"
                    :color="this.error ? 'error' : 'primary'"
                    block
                    @click="resetPassword"
                  >
                    重置密码
                  </v-btn>
                </v-col>

                <v-col v-if="error">
                  <v-alert elevation="4" type="error">{{ error }}</v-alert>
                </v-col>

              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {isEmail} from "@/utils/validate_input";
import md5 from "md5";
import axios from "@/utils/axios";
import {goBack} from "@/utils/router";

export default {
  data() {
    let that = this;
    return {
      token: '',
      password: '',
      passwordConfirm: '',

      tokenRules: [v => {
        console.log(that.tokenValid)
        return that.tokenValid || 'token 错误或已过期'}
      ],
      passwordRules: [v => v.length >= 6 || '密码应不少于 6 位'],
      passwordConfirmRules: [v => v === that.password || '两次输入密码应当相同'],

      checkingToken: true,
      tokenValid: true,
      formValid: true,
      submitting: false,
      error: null,
    };
  },

  activated() {
    let that = this;
    // 进入页面，填入 token 并验证有效性
    this.token = this.$route.query.token;
    axios.post('/accounts/resetpassword/', {token: that.token})
      .then(() => {
        that.tokenValid = true;
      }).catch(() => {
        that.tokenValid = false;
      }).finally(() => {
        that.checkingToken = false;
        that.$refs.token.validate(true);
      });
  },

  methods: {
    resetPassword() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.error = null;
      let data = {
        token: this.token,
        new_password: md5(this.password),
      }
      let that = this;
      axios.post('/accounts/resetpassword/', data)
        .then(() => {
          this.$store.commit('postMsg', '重置成功！请重新登录~');
          this.$store.commit('clearProfile');
          this.$router.push('/login/');
        }).catch(response => {
          let detail = response.data;
          this.error = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
};
</script>

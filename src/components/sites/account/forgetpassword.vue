<template>
  <!-- 外层的 container、row、col 是为了限制 card 的布局 -->
  <v-container>
    <v-row class="justify-center">
      <v-col xs="12" md="8">
        <v-card>
          <v-card-text>
            <v-form
              @submit.prevent="submit"
              ref="forgetPasswordForm"
              v-model="formValid"
            >
              <!-- 内层的 container、col 是为了限制 form 的布局 -->
              <v-container>
                <v-col>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    type="email"
                    label="邮箱"
                    prepend-icon="mdi-email"
                    required />
                </v-col>

                <v-col>
                  <v-btn
                    v-if="status !== 'success'"
                    :disabled="!formValid"
                    :loading="submitting"
                    :color="status==='error' ? 'error' : 'primary'"
                    block
                    type="submit"
                  >
                    发送邮件
                  </v-btn>
                </v-col>

                <v-col v-if="status">
                  <v-alert elevation="4" :type="status">{{ msg }}</v-alert>
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
import Vue from 'vue'

import { goBack } from '@/utils/router';
import router from "@/router/index";
import axios from '@/utils/axios';
import md5 from "md5";
import {isEmail} from "@/utils/validate_input";

export default Vue.extend({
  data: () => ({
    email: "",
    emailRules: [v => isEmail(v) || '邮箱不合法'],

    formValid: true,
    submitting: false,
    status: null,
    msg: null,
  }),

  methods: {
    submit() {
      this.formValid = this.$refs.forgetPasswordForm.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.status = null;
      this.msg = null;

      let that = this;
      let data = {
        email: this.email
      };
      axios.post('/accounts/forgetpassword/', data)
        .then((response) => {
          that.msg = response.data;
          if (that.msg.detail) that.msg = that.msg.detail
          that.status = 'success';
          that.submitting = false;
        })
        .catch((response) => {
          that.msg = response.data;
          if (that.msg.detail) that.msg = that.msg.detail
          that.status = 'error';
          that.submitting = false;
        })
    },
  },
});
</script>

<template>
  <SimpleCard>
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
            required/>
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
  </SimpleCard>
</template>

<script>

import axios from '@/utils/axios';
import {isEmail} from "@/utils/validate_input";
import SimpleCard from '@/components/ui/base/simple-card'

export default {
  components: {SimpleCard},
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
};
</script>

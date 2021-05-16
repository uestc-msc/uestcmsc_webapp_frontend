<template>
  <SimpleCard>
    <v-form
      @submit.prevent="submit"
      ref="form"
      v-model="formValid"
    >
      <!-- 内层的 container、col 是为了限制 form 的布局 -->
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              :disabled="submitting"
              type="email"
              label="邮箱"
              prepend-icon="mdi-email"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
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
        </v-row>

        <ErrorAlert
          as-row
          v-if="status"
          :type="status"
          :msg="msg"
        />
      </v-container>
    </v-form>
  </SimpleCard>
</template>

<script>

import {inputRules, isEmail} from "@/utils/validators";
import SimpleCard from '@/components/ui/base/simple-card'
import {forgetPassword} from "@/api/account";
import ErrorAlert from "@/components/ui/base/error-alert";

export default {
  components: {ErrorAlert, SimpleCard},
  data: () => ({
    email: "",
    emailRules: inputRules.user.usernameRules,

    formValid: true,
    submitting: false,
    status: null,
    msg: null,
  }),

  methods: {
    submit() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.status = null;
      this.msg = null;

      let that = this;
      let data = {
        email: this.email
      };
      forgetPassword(data)
        .then((response) => {
          that.msg = response.data;
          if (that.msg.detail) that.msg = that.msg.detail
          that.status = 'success';
          that.submitting = false;
        })
        .catch((response) => {
          console.warn(response);
          that.msg = response.data;
          if (that.msg.detail) that.msg = that.msg.detail
          that.status = 'error';
          that.submitting = false;
        })
    },
  },
};
</script>

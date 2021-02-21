<template>
  <SimpleCard>
    <v-form
      @submit.prevent="signup"
      ref="form"
      v-model="valid"
    >
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="first_name"
              :rules="firstNameRules"
              :disabled="submitting"
              label="姓名 *"
              prepend-icon="mdi-account"
              required
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              :disabled="submitting"
              type="email"
              label="邮箱 *"
              prepend-icon="mdi-email"
              required/>
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
              counter
              label="密码 *"
              prepend-icon="mdi-lock"
              @input="$refs.passwordConfirm.validate(true)"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="password_confirm"
              :rules="passwordConfirmRules"
              :disabled="submitting"
              :type="show_password_confirm ? 'text' : 'password'"
              :append-icon="show_password_confirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show_password_confirm = !show_password_confirm"
              counter
              label="重复密码 *"
              prepend-icon="mdi-lock-check"
              ref="passwordConfirm"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="student_id"
              :rules="studentIdRules"
              :disabled="submitting"
              type="number"
              label="学号 *"
              prepend-icon="mdi-school"
              required/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-alert type="success" icon="mdi-wechat" dismissible>
              我们已将“阮薇薇点名啦”微信小程序 v1 的数据迁移到了 Web App。<br>
              您只需在注册时，使用和小程序相同的姓名与学号，即可自动绑定信息。
            </v-alert>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-btn
              :disabled="!valid"
              :loading="submitting"
              :color="this.error ? 'error' : 'primary'"
              block
              @click="signup"
            >
              注册
            </v-btn>
          </v-col>
        </v-row>

        <FormErrorAlert
          v-if="error"
          :msg="error"
        />

      </v-container>
    </v-form>
  </SimpleCard>
</template>

<script>
import md5 from "md5";
import axios from "@/utils/axios";
import {goBack} from "@/utils/router";
import SimpleCard from "@/components/ui/base/simple-card";
import {inputRules} from "@/utils/validators";
import FormErrorAlert from "@/components/ui/base/form-error-alert";

export default {
  components: {FormErrorAlert, SimpleCard},
  data() {
    let that = this;
    return {
      first_name: '',
      username: '',
      password: '',
      show_password: false,
      password_confirm: '',
      show_password_confirm: false,
      student_id: null,

      firstNameRules: inputRules.user.firstNameRules,
      usernameRules: inputRules.user.usernameRules,
      passwordRules: inputRules.user.passwordRules,
      passwordConfirmRules: inputRules.user.passwordConfirmRules(that),
      studentIdRules: inputRules.user.studentIdRules,

      valid: true,
      submitting: false,
      error: null,
    };
  },

  methods: {
    signup() {
      this.valid = this.$refs.form.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.error = null;
      let data = {
        username: this.username,
        password: md5(this.password),
        first_name: this.first_name,
        email: this.email,
        student_id: this.student_id
      }
      let that = this;
      axios.post('/accounts/signup/', data)
        .then((response) => {
          if (response.status === 200) // 是微信小程序的用户
            that.$store.commit('postMsg', `欢迎回来，${response.data.first_name}~`)
          else // 是新注册的用户
            that.$store.commit('postMsg', '注册成功~')
          goBack();
        })
        .catch(response => {
          let detail = response.data;
          if (typeof (detail) == 'string')
            that.error = detail;
          else if (typeof (detail) == 'object')
            that.error = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
};
</script>

<template>
  <SimpleCard>
    <v-form
      @submit.prevent="signup"
      ref="form"
      v-model="valid"
    >
      <v-container>
        <v-col>
          <v-text-field
            v-model="firstName"
            :rules="firstNameRules"
            label="姓名 *"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            prepend-icon="mdi-account"
            required/>
        </v-col>

        <v-col>
          <v-text-field
            v-model="username"
            :rules="usernameRules"
            type="email"
            label="邮箱 *"
            prepend-icon="mdi-email"
            required/>
        </v-col>

        <v-col>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            type="password"
            label="密码 *"
            prepend-icon="mdi-lock"
            @input="$refs.passwordConfirm.validate(true)"
            required/>
        </v-col>

        <v-col>
          <v-text-field
            v-model="passwordConfirm"
            :rules="passwordConfirmRules"
            type="password"
            label="重复密码 *"
            prepend-icon="mdi-lock-check"
            ref="passwordConfirm"
            required/>
        </v-col>

        <v-col>
          <v-text-field
            v-model="studentId"
            :rules="studentIdRules"
            type="number"
            label="学号 *"
            prepend-icon="mdi-school"
            required/>
        </v-col>

        <v-col>
          <v-alert type="success" icon="mdi-wechat" dismissible>
            我们已将“阮薇薇点名啦”微信小程序 v1 的数据迁移到了 Web App。<br>
            您只需在注册时，使用和小程序相同的姓名与学号，即可自动绑定信息。
          </v-alert>
        </v-col>

        <v-col>
          <v-btn
            :disabled="!valid"
            :submitting="submitting"
            :color="this.error ? 'error' : 'primary'"
            block
            @click="signup"
          >
            注册
          </v-btn>
        </v-col>

        <v-col v-if="error">
          <v-alert elevation="4" type="error" transition="scroll-y-reverse-transition">{{ error }}</v-alert>
        </v-col>

      </v-container>
    </v-form>
  </SimpleCard>
</template>

<script>
import {isEmail} from "@/utils/validate_input";
import md5 from "md5";
import axios from "@/utils/axios";
import {goBack} from "@/utils/router";
import SimpleCard from "@/components/ui/base/simple-card";

export default {
  components: {SimpleCard},
  data() {
    let that = this;
    return {
      firstName: '',
      username: '',
      password: '',
      passwordConfirm: '',
      studentId: null,

      firstNameRules: [v => !!v || '姓名不能为空'],
      usernameRules: [v => isEmail(v) || '邮箱不合法'],
      passwordRules: [v => v.length >= 6 || '密码应不少于 6 位'],
      passwordConfirmRules: [v => v === that.password || '两次输入密码应当相同'],
      studentIdRules: [v => {
        return /\d+/.test(v) || '学号应当为数字'
      }],

      valid: true,
      submitting: false,
      error: null,
    };
  },

  methods: {
    signup() {
      console.log(this.$refs.form)
      this.valid = this.$refs.form.validate();
      if (!this.valid)
        return;

      this.submitting = true;
      this.error = null;
      let data = {
        username: this.username,
        password: md5(this.password),
        first_name: this.firstName,
        email: this.email,
        student_id: this.studentId
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
          that.error = Object.values(detail).join('；');
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },
};
</script>

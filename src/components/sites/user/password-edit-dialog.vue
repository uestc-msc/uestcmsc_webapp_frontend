<!--   下面是密码修改部分     -->
<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="defaultProps">
      <slot name="activator" v-bind="defaultProps"/>
    </template>
    <v-card>
      <v-card-title>
        <span>
          修改{{ isSelf ? '您' : user.first_name }}的密码
        </span>
        <v-spacer/>
        <v-card-actions>
          <v-btn
            color="grey"
            icon
            @click="dialog=false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card-title>

      <v-container>
        <v-row class="justify-center">
          <v-col>
            <v-form
              ref="form"
              v-model="formValid"
              key="1"
            >

              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="oldPassword"
                    :rules="passwordRules"
                    :disabled="submitting"
                    :type="showOldPassword ? 'text' : 'password'"
                    :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showOldPassword = !showOldPassword"
                    counter
                    :label="isSelf ? '旧密码 *' : '验证您的密码 *'"
                    prepend-icon="mdi-form-textbox-password"
                    required/>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :disabled="submitting"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showNewPassword = !showNewPassword"
                    @input="$refs.passwordConfirm.validate(true)"
                    counter
                    :label="isSelf ? '新密码 *' : user.first_name + '的新密码 *'"
                    prepend-icon="mdi-lock"
                    required/>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="passwordConfirm"
                    :rules="passwordConfirmRules"
                    :disabled="submitting"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPasswordConfirm = !showPasswordConfirm"
                    counter
                    label="重复新密码 *"
                    prepend-icon="mdi-lock-check"
                    ref="passwordConfirm"
                    required/>
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col>
                  <v-btn
                    v-if="!success"
                    :disabled="!formValid"
                    :loading="submitting"
                    :color="error ? 'error' : 'primary'"
                    block
                    @click="submitPassword"
                  >
                    修改密码
                  </v-btn>
                  <v-btn v-else color="success" block>
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <ErrorAlert
                as-row
                v-if="error"
                :msg="error"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import {inputRules} from "@/utils/validators";
import {hasGreaterPermissions} from "@/utils/permissions";
import md5 from "md5";
import {changePassword} from "@/api/user";
import {displaySuccessTime} from "@/utils";
import SimpleCard from "@/components/ui/base/simple-card";
import ErrorAlert from "@/components/ui/base/error-alert";

export default {
  components: {ErrorAlert, SimpleCard},
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    let that = this;
    return {
      dialog: false,

      oldPassword: '',
      showOldPassword: false,
      password: '',
      showNewPassword: false,
      passwordConfirm: '',
      showPasswordConfirm: false,

      // 用 Status 重构 User 和 Account 部分的所有提交
      formValid: true,
      submitting: false,
      error: null,
      success: false,

      passwordRules: inputRules.user.passwordRules,
      passwordConfirmRules: inputRules.user.passwordConfirmRules(that),
    }
  },

  computed: {
    hasGreaterPermissions() {
      return hasGreaterPermissions(this.$store.state.profile, this.user);
    },
    isSelf() {
      return this.$store.state.profile.id === this.user.id;
    },
    canChangePassword() {
      return this.hasGreaterPermissions || this.isSelf;
    },
  },

  methods: {
    valueChange() {
      console.log(this.value);
      this.$emit('input', this.value);
    },
    submitPassword() {
      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.submitting = true;
      this.success = false;
      this.error = null;

      let data = {
        old_password: md5(this.oldPassword),
        new_password: md5(this.password),
      };
      let that = this;
      changePassword(this.user.id, data)
        .then(async () => {
          if (that.isSelf) {
            that.$store.commit('setMsg', '修改成功！请重新登录~');
            that.$store.commit('clearProfile');
            that.$router.push('/login/');
          } else {
            that.$store.commit('setMsg', '修改成功！');
            that.success = true;
            await sleep(displaySuccessTime);
            that.success = false;
          }
        })
        .catch(response => {
          that.error = response.data;
          if (response.status === 403)
            that.error = "旧密码错误。";
        })
        .finally(() => {
          that.submitting = false;
        });
    },
  },

  activated() {
    this.submitting = false;
    this.success = false;
    this.error = false;
  }
}
</script>
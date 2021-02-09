<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xs="12" md="8">
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-container>
                <v-col>
                  <v-text-field
                    v-model="first_name"
                    :rules="firstNameRule"
                    label="姓名 *"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    prepend-icon = "mdi-account"
                    required />
                </v-col>
                <v-col>
                <v-text-field
                    v-model="email"
                    :rules="emailRule"
                    type="email"
                    label="邮箱 *"
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
                <v-col>
                  <v-text-field
                      v-model="student_id"
                      label="学号 *"
                      prepend-icon = "mdi-school"
                      required />
                </v-col>
                <v-col mt-3>
                  <v-btn
                    :loading="loading"
                    :color="signup_button_color"
                    block
                    big
                    type="submit">注册</v-btn>
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
export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      displayName: '',
      school: '',
      company: '',
      location: '',
      codeforces: '',
      atcoder: '',
      studentID: '',
      gender: true,
      about: 'The man is too lazy to leave anything.',
      loading: false,
      error: null,
    };
  },
  computed: {
    signup_button_color: function () {
      return this.error ? 'error' : 'primary';
    },
  },

  methods: {

    getErrorByDelegate(field) {
      return getErrorMessage(this.error, field);
    },

    register() {
      this.error = null;
      const {
        username, password, email, about, school, company, location, codeforces, atcoder,
      } = this;
      this.$store.dispatch('user/signup', {
        username, password, email, about, school, company, location, codeforces, atcoder,
      })
        .then(() => {
          this.$router.push(this.$route.query.redirect || '/');
        })
        .catch((error) => {
          this.error = parseGraphqlError(error);
        })
        .finally(() => { that.loading = false; });
    },
  },
};
</script>

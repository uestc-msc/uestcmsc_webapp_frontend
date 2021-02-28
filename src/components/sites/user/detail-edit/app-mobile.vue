<template>
  <SimpleCard
    md="8"
    v-if="userProfile"
  >
    <v-form
      @submit.prevent="submit"
      ref="form"
      v-model="valid"
    >
      <v-container>
        <v-row
          no-gutters
          align="center"
        >
          <v-col cols="6">
            <v-card>
              <v-img :src="userProfile.avatar_url"/>
            </v-card>
          </v-col>

          <v-spacer/>

          <v-col cols="5">
            我们使用了 Gravatar API。您只需按照<a href="https://cn.gravatar.com/support/activating-your-account/">教程</a>，在 Gravatar
            上传自己的头像，此处的头像就会更新。
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-text-field
            v-model="userProfile.first_name"
            :rules="firstNameRules"
            :disabled="submitting"
            label="姓名 *"
            prepend-icon="mdi-account"
            required
          />
        </v-row>

        <v-row no-gutters>
          <v-col>
          <v-text-field
            v-model="userProfile.last_name"
            :disabled="submitting"
            label="称号"
            prepend-icon="mdi-alpha-t-circle"
          />
            </v-col>
        </v-row>

        <v-row no-gutters>
          <v-text-field
            v-model="userProfile.student_id"
            :rules="studentIdRules"
            :disabled="submitting"
            type="number"
            label="学号 *"
            prepend-icon="mdi-school"
            required/>
        </v-row>

        <v-row no-gutters>
          <v-textarea
            label="自我介绍"
            :disabled="submitting"
            :rules="aboutRules"
            auto-grow
            counter
            v-model="userProfile.about"
          />
        </v-row>

        <v-row no-gutters>
          <v-switch
            label="订阅邮件推送"
            v-model="userProfile.subscribe_email"
          />
        </v-row>

        <v-row
          no-gutters
          align="center"
        >
          <v-col cols="4">
            <v-btn
              v-if="canChangePassword"
              color="warning"
              @click="gotoChangePassword"
            >
              修改密码
            </v-btn>
          </v-col>

          <v-spacer />

          <v-col>
            <v-btn
              v-if="success"
              color="success"
              width="100px"
            >
              <v-icon>
                mdi-check
              </v-icon>
            </v-btn>

            <v-btn
              v-else
              :color="error ? 'error' : 'primary'"
              :disabled="!valid"
              :loading="submitting"
              width="100px"
              @click="submit"
            >
              更新信息
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
import component from "./script"
import _ from 'lodash'

export default _.cloneDeep(component);
</script>

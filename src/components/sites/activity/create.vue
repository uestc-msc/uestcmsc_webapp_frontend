<template>
  <div>
  <SimpleCard>
    <v-form
      ref="form"
      v-model="formValid"
    >
      <v-container>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              prepend-icon="mdi-book-open-page-variant"
              v-model="formData.title"
              :rules="titleRules"
              :disabled="status === Status.submitting"
              label="主题 *"
            />
          </v-col>
        </v-row>

        <DatetimePicker
          no-gutters
          v-model="formData.datetime"
          :disabled="status === Status.submitting"
        />

        <v-row no-gutters>
          <v-col>
            <v-text-field
              prepend-icon="mdi-map-marker"
              v-model="formData.location"
              :rules="locationRules"
              :disabled="status === Status.submitting"
              label="地点 *"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <PeopleSelector
              v-model="formData.presenter"
              :rules="presenterRules"
              label="选择主讲人 *"
              prepend-icon="mdi-account"
              :disabled="status === Status.submitting"
            />
          </v-col>
        </v-row>

        <ErrorAlertRow
          v-if="errorMsg"
          :msg="errorMsg"
        />
      </v-container>
    </v-form>
  </SimpleCard>

  <FloatingActionButton
    :icon="StatusIcon[status]"
    :color="StatusColor[status]"
    :disabled="!formValid"
    :loading="status === Status.submitting"
    tooltip="保存"
    @click="updateData"
  />
  </div>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";
import {DEBUG, displayErrorTime, sleep} from "@/utils";
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {Status, StatusColor, StatusIcon} from "@/utils/status";
import {createActivity} from "@/api/activity";
import DatetimePicker from "@/components/ui/base/datetime-picker";
import {inputRules} from "@/utils/validators";
import FloatingActionButton from "@/components/ui/base/floating-action-button";

export default {
  components: {FloatingActionButton, DatetimePicker, ErrorAlertRow, PeopleSelector, SimpleCard},

  data() {
    let presenter = [];
    if (this.$store.getters.isAuthenticated) {
      presenter.push(this.$store.profile.id);   // 默认自己为主讲人
    }
    return {
      Status,
      StatusColor,
      StatusIcon,

      formData: {
        title: '',
        datetime: moment().format('YYYY-MM-DD') + 'T16:00+08:00',
        location: '',
        presenter,
      },

      titleRules: inputRules.activity.titleRules,
      locationRules: inputRules.activity.locationRules,
      presenterRules: inputRules.activity.presenterRules,

      formValid: false,
      errorMsg: "",
      status: Status.editing,
    }
  },

  methods: {
    updateData() {
      if (this.status !== Status.editing)
        return;

      this.formValid = this.$refs.form.validate();
      if (!this.formValid)
        return;

      this.errorMsg = '';
      this.status = Status.submitting;
      createActivity(this.formData)
        .then(async res => {
          let activity = res.data;
          this.status = Status.success;
          this.$store.commit('setMsg', '创建成功~');
          this.$router.push({
            name: 'ActivityDetail',
            params: {
              activity,
              activityId: activity.id
            }
          });
        })
        .catch(async res => {
          this.errorMsg = res.data;
          this.status = Status.error;
          await sleep(displayErrorTime);
          this.status = Status.editing;
        })
    }
  },

  activated() {
    if (!DEBUG)
      window.onbeforeunload = () => '系统可能不会保存您所做的更改。'
    this.$store.commit('setTitle', '创建沙龙');
  },

  deactivated() {
    window.onbeforeunload = null;
    this.$store.commit('clearTitle');
  }
}
</script>
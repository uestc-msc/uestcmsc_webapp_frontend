<template>
  <div>
  <SimpleCard>
    <v-form ref="form">
      <v-row no-gutters>
        <v-col>
          <v-text-field
            prepend-icon="mdi-book-open-page-variant"
            v-model="formData.title"
            :rules="titleRules"
            :disabled="status === Status.submitting"
            label="主题"
            @change="updateData"
          />
        </v-col>
      </v-row>

      <DatetimePicker
        v-model="formData.datetime"
        :disabled="disabled"
        @change="updateData"
      />

      <v-row no-gutters>
        <v-col>
          <v-text-field
            prepend-icon="mdi-map-marker"
            v-model="formData.location"
            :rules="locationRules"
            :disabled="disabled"
            label="地点"
            @change="updateData"
          />
        </v-col>
      </v-row>



    <ErrorAlertRow
      :msg="error"
    />
    </v-form>
  </SimpleCard>

  <FloatingActionButton
    :icon="StatusIcon[status]"
    :color="StatusColor[status]"
    :loading="status === Status.submitting"
    tooltip="保存"
    @click="updateData"
  />
  </div>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";
import FileUploader from "@/components/ui/file/file-uploader";
import {DEBUG, displayErrorTime, displaySuccessTime, sleep} from "@/utils";
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {Status, StatusColor, StatusIcon} from "@/utils/status";
import {createActivity, updateActivityDetail} from "@/api/activity";
import DatetimePicker from "@/components/ui/base/datetime-picker";
import {inputRules} from "@/utils/validators";

export default {
  components: {DatetimePicker, ErrorAlertRow, PeopleSelector, SimpleCard},

  data() {
    let that = this;
    return {
      formData: {
        title: '',
        datetime: '',
        location: '',
        presenter: [that.$store.state.profile.id],
      },

      titleRules: inputRules.activity.titleRules,
      locationRules: inputRules.activity.locationRules,
      presenterRules: inputRules.activity.presenterRules,

      error,
      status,
      Status,
      StatusColor,
      StatusIcon,
    }
  },

  methods: {
    updateData() {
      if (this.status !== Status.editing)
        return;

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
          this.status = Status.error;
          this.$store.commit('setMsg', res.data);
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
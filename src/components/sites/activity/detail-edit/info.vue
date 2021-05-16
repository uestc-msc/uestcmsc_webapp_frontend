<template>
  <v-container>
    <v-form ref="form">
      <v-row no-gutters>
        <v-col>
          <v-text-field
            prepend-icon="mdi-book-open-page-variant"
            v-model="formData.title"
            :rules="titleRules"
            :disabled="disabled"
            label="主题 *"
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
            label="地点 *"
            @change="updateData"
          />
        </v-col>
      </v-row>

      <v-row no-gutters align="center">
        <v-col>
          <v-switch
            prepend-icon="mdi-checkbox-marked-circle-outline"
            v-model="formData.check_in_open"
            :disabled="disabled"
            label="开放二维码签到"
            @change="updateData"
          />
        </v-col>

        <v-spacer/>
        <v-col>
          <v-row no-gutters justify="end">
            <ConfirmDialog @confirm="deleteData">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :disabled="disabled"
                  :loading="deleting"
                  color="error"
                  v-on="on"
                  v-bind="attrs"
                >
                  删除活动
                </v-btn>
              </template>
            </ConfirmDialog>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import moment from "@/utils/moment";
import DatetimePicker from "@/components/ui/base/input/datetime-picker";
import {inputRules} from "@/utils/validators";
import ConfirmDialog from "@/components/ui/base/confirm-dialog";
import {deleteActivity} from '@/api/activity'

export default {
  components: {ConfirmDialog, DatetimePicker},
  props: {
    activity: {
      // type: Object, 刚进入时可能还没加载 activity 因此不做检查
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      formData: {
        title: '',
        datetime: moment().format(),
        location: '',
        check_in_open: false,
      },

      deleting: false,

      titleRules: inputRules.activity.titleRules,
      locationRules: inputRules.activity.locationRules
    }
  },

  methods: {
    fetchData() {   // 根据 activity 更新 data
      if (!this.activity)
        return;
      for (let attr in this.formData)
        this.formData[attr] = this.activity[attr];
    },

    updateData() {   // 根据 data 更新 activity
      console.log(`updateData, datetime is ${this.formData.datetime}`);
      let new_activity = {...this.activity};
      for (let attr in this.formData)
        new_activity[attr] = this.formData[attr];
      this.$emit('update:activity', new_activity);
    },

    deleteData() { // 删除活动
      this.deleting = true;
      this.$emit('update:disabled', true);
      let that = this;
      deleteActivity(this.activity.id)
        .then(res => {
          that.$store.commit('setMsg', '删除成功~');
          that.$router.push({name: 'ActivityList'});
        })
        .catch(res => {
          console.warn(res);
          that.$store.commit('setMsg', res.data);
        });
    }
  },

  watch: {
    'activity.id'() {
      this.fetchData();
    },
  },

  created() {
    this.fetchData();
  },
};
</script>
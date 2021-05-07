<template>
  <v-container>
    <v-form ref="form">
      <v-row no-gutters>
        <v-col>
          <PeopleSelector
            v-model="presenterArray"
            :rules="presenterRules"
            label="选择主讲人 *"
            prepend-icon="mdi-account"
            :disabled="disabled"
            @input="updateData"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <PeopleSelector
            v-model="attenderArray"
            label="选择参与人 *"
            prepend-icon="mdi-account-multiple"
            :disabled="disabled"
            :loading="!!attenderUpdatingCount"
            @input="updateAttenderArray"
          />
        </v-col>
      </v-row>

      <ErrorAlertRow
        v-if="attenderUpdateError"
        msg="更新参与人名单失败，请点击右下角保存按钮、保存其他数据后刷新重试"/>
    </v-form>
  </v-container>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";
import {DEBUG, totalRetryTimes} from "@/utils";
import {updateActivityAttender} from "@/api/activity";
import ErrorAlertRow from "@/components/ui/base/error-alert-row";
import {inputRules} from "@/utils/validators";

export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  components: {ErrorAlertRow, SimpleCard, PeopleSelector},
  data() {
    return {
      presenterArray: [],
      attenderArray: [],
      // 更新前的名单。以此作为基准进行增量更新
      lastAttenderArray: [],

      presenterRules: inputRules.activity.presenterRules,
      attenderUpdatingCount: 0,
      attenderUpdateError: false,
    }
  },

  methods: {
    // todo 感觉管理员修改名单和普通用户签到并行起来以后很容易出 bug，有时间一定多测试
    async updateAttenderArray() {
      function arrayDiff(newArr, oldArr) {
        // 由于子组件保证有序，这里直接使用双指针
        let add = [], remove = [], i = 0, j = 0;
        while(i < newArr.length && j < oldArr.length) {
          if (newArr[i] > oldArr[j]) {
            remove.push(oldArr[j]);
            j++;
          } else if (newArr[i] < oldArr[j]) {
            add.push(newArr[i]);
            i++;
          } else {
            i++;
            j++;
          }
        }
        while(i < newArr.length) {
          add.push(newArr[i]);
          i++;
        }
        while(j < oldArr.length) {
          remove.push(oldArr[j]);
          j++;
        }
        return {add, remove};
      }
      let {add, remove} = arrayDiff(this.attenderArray, this.lastAttenderArray);
      this.lastAttenderArray = this.attenderArray;  // 下次更改将以本次作为基准 计算增量
      this.attenderUpdatingCount++;
      if (DEBUG)
        console.log(`add [${add}], remove [${remove}]...`);
      let res;
      for (let i = 1; i <= totalRetryTimes; i++) {
        try {
          res = await updateActivityAttender(this.activity.id, {add, remove});
          this.attenderUpdatingCount--;
          if (this.attenderUpdatingCount === 0)   // 如果没有别的更新请求，就用服务器给的名单覆盖
            this.attenderArray = res.data.attender;
          break;
        }
        catch (err) {
          if (i === 5) {
            this.attenderUpdateError = true;
            // this.attenderArray = this.lastAttenderArray;
            this.attenderUpdatingCount--;
            throw err;
          }
        }
      }

    },

    fetchData() {   // 根据 activity 更新 presenterList attenderList
      this.presenterArray = this.activity.presenter;
      this.attenderArray = this.activity.attender;
      this.lastAttenderArray = [...this.attenderArray];
      this.attenderUpdatingCount = 0;
    },

    updateData() {   // 根据 presenterList 更新 activity
      let new_activity = {...this.activity};
      new_activity.presenter = this.presenterArray;
      // attenderArray 的数据不能交给 activity，因为 updateAttenderArray 的逻辑是
      // 比对 val 和 attenderArray 计算出差值然后增量更新，如果更新 attenderArray 可能导致增量出现误差
      // new_activity.attender = this.attenderArray.map(id => ({id: id}));
      this.$emit('update:activity', new_activity);
    }
  },

  watch: {
    activity() {
      this.fetchData();
    }
  },

  created() {
    this.fetchData();
  },
}
</script>ipt>
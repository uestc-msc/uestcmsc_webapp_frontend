<!--  定义在一个 row 里的 DateTimePicker，返回 TZ 形式  -->
<template>
  <v-row>
    <v-col>
      <DatePicker
        v-model="date"
        :disabled="disabled"
      />
    </v-col>

    <v-col>
      <TimePicker
        v-model="time"
        :disabled="disabled"
      />
    </v-col>
  </v-row>
</template>

<script>
import DatePicker from "@/components/ui/base/input/date-picker";
import TimePicker from "@/components/ui/base/input/time-picker";
import moment from '@/utils/moment';

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  components: {TimePicker, DatePicker},

  computed: {
    _datetime: {
      get() {
        return moment(this.value);
      },
      set(val) {
        const formattedVal = val.format();
        this.$emit('input', formattedVal);
        this.$emit('change', formattedVal);
      }
    },

    date: {
      get() {
        return this._datetime.format('YYYY-MM-DD');
      },
      set(val) {
        this._datetime = moment(val + ' ' + this.time);
      }
    },

    time: {
      get() {
        return this._datetime.format('HH:mm');
      },
      set(val) {
        this._datetime = moment(this.date + ' ' + val);
      }
    }
  },
}
</script>
<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :disabled="disabled"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        label="时间 *"
        :prepend-icon="clockIcon"
        readonly
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
      />
    </template>

    <v-time-picker
      v-if="menu"
      v-model="time"
      :disabled="disabled"
      format="24hr"
      full-width
    >
    </v-time-picker>
  </v-menu>
</template>

<script>
import {getTimeIcon} from '@/utils/datetime';

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      menu: false
    }
  },

  computed: {
    time: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    clockIcon() {
      const hour = Number(this.time.split(':')[0]);
      return getTimeIcon(hour);
    }
  },

}
</script>
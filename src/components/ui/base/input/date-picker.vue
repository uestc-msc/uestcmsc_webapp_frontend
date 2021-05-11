<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        label="日期 *"
        prepend-icon="mdi-calendar"
        readonly
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date"
      locale="zh"
      :day-format="val => Number(val.slice(val.length-2))"
      scrollable
      :disabled="disabled"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="menu = false"
        :disabled="disabled"
      >
        取消
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.menu.save(date)"
        :disabled="disabled"
      >
        确定
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
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
    date: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
}
</script>
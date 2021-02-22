<template>
<!-- 需要放在 v-container 里 -->
  <v-row no-gutters>
    <v-col>
      <v-alert elevation="4" :type="type">
        {{ msg }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'error'
    },
    msg: {
      type: String | Object,
      default: '哎呀，出错了'
    }
  }
};
</script>
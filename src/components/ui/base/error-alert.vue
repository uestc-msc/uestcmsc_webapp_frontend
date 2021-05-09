<!-- 可以单独作为一个 component 使用 -->
<template>
  <v-slide-y-transition>
    <v-row v-if="asRow">
      <v-col>
        <v-alert
          elevation="4"
          :type="type"
          v-bind="$attrs"
        >
          {{ msg }}
        </v-alert>
      </v-col>
    </v-row>

    <v-container v-else fluid>
      <v-row justify="center">
        <v-col xs="12" md="8">
          <v-alert
            elevation="4"
            :type="type"
            v-bind="$attrs"
          >
            {{ msg }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-slide-y-transition>
</template>

<script>
export default {
  props: {
    asRow: {
      type: Boolean,
      default: false
    },
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
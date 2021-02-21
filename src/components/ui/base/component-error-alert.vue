<template>
<!-- 可以单独作为一个 component 使用 -->
  <v-container fluid>
    <v-alert
      elevation="4"
      type="error">
      <slot>哎呀，出错了</slot>
    </v-alert>
  </v-container>
</template>

<script>
export default {};
</script>
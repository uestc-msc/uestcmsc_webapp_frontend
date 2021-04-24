<!-- 可以单独作为一个 component 使用 -->
<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" md="8">
        <v-alert
          elevation="4"
          type="error">
          <slot>哎呀，出错了</slot>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
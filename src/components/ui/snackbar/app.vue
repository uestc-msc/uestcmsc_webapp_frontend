<template>
  <v-snackbar v-model="$store.state.snackbar.visible">
    {{ $store.state.snackbar.msg }}
    <v-btn
      text
      color="accent"
      @click.native="$store.state.snackbar.visible = false">
      关闭
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {};
</script>

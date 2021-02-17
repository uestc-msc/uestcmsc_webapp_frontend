<template>
  <v-snackbar
    v-model="$store.state.snackbar.visible"
  >
    {{ $store.state.snackbar.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        @click.native="$store.state.snackbar.visible = false">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {};
</script>

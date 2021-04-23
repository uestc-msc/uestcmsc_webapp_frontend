<template>
  <v-snackbar
    :value="$store.state.snackbar.visible"
  >
    {{ $store.state.snackbar.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="pink"
        text
        v-bind="attrs"
        @click.native="$store.commit('clearMsg')">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {};
</script>

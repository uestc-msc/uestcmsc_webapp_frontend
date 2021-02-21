<template>
  <v-icon
    v-if="isAdmin"
    :size="size"
    :color="color"
  >
    mdi-badge-account-horizontal
  </v-icon>
</template>

<script>
export default {
  props: ['user', 'color', 'size'],

  computed: {
    isAdmin() {
      return this.user.is_staff || this.user.is_superuser;
    }
  }
}
</script>
<!-- admin 图标 -->
<template>
  <v-icon
    class="ml-1"
    v-if="isAdmin"
    :size="size"
    :color="color"
  >
    mdi-badge-account-horizontal
  </v-icon>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '14px'
    }
  },

  computed: {
    isAdmin() {
      return this.user.is_staff || this.user.is_superuser;
    }
  }
}
</script>
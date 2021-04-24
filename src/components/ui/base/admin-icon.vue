<!-- admin 图标 -->
<template>
  <v-icon
    class="admin-icon"
    v-if="isAdmin"
    :size="size"
    :color="color"
  >
    mdi-badge-account-horizontal
  </v-icon>
</template>

<style>
.admin-icon {
  margin-left: 4px;
}
</style>

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
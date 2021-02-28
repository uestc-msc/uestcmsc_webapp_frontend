<template>
  <UserDetailMobile v-if="$vuetify.breakpoint.xsOnly"/>
  <UserDetailDesktop v-else/>
</template>

<script>
import UserDetailDesktop from "@/components/sites/user/detail-edit/app-desktop";
import UserDetailMobile from "@/components/sites/user/detail-edit/app-mobile";
export default {
  components: {UserDetailMobile, UserDetailDesktop}
}
</script>
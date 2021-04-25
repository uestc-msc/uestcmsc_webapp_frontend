<!-- 表示用户的 chip，包含头像、姓名和链接  -->
<!-- 推荐被包含在 <v-chip-group> 中，或者使用封装的 PeopleChipGroup  -->
<template>
  <v-chip
    link
    text-color="white"
    color="blue-grey lighten-2"
    @click="gotoUserDetail"
  >
    <v-avatar left>
      <v-img :src="user.avatar_url"></v-img>
    </v-avatar>

    <span>
    {{ user.first_name }}
    </span>

    <AdminIcon :user="user"/>
  </v-chip>
</template>

<script>
import AdminIcon from "@/components/ui/base/admin-icon";
export default {
  components: {AdminIcon},
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  methods: {
    gotoUserDetail() {
      this.$router.push({
        name: 'UserDetail', params: {
          userProfile: this.user,
          userId: this.user.id
        }
      })
    }
  },
}
</script>
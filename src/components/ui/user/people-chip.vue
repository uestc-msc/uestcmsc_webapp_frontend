<!-- 表示用户的 chip，包含头像、姓名和链接  -->
<!-- 推荐被包含在 <v-chip-group> 中，或者使用封装的 PeopleChipGroup  -->
<template>
  <v-chip
    link
    text-color="white"
    color="blue-grey lighten-2"
    @click.stop="gotoUserDetail"
  >
    <v-avatar left>
      <v-img
        :src="user.avatar_url"
        :lazy-src="avatarDefault"
      >
        <template v-slot:placeholder>
          <PicturePlaceholder size="24" width="3"/>
        </template>
      </v-img>
    </v-avatar>

    <span>
    {{ user.first_name }}
    </span>

    <AdminIcon :user="user"/>
  </v-chip>
</template>

<script>
import AdminIcon from "@/components/ui/user/admin-icon";
import {lazyAvatar} from "@/utils";
import PicturePlaceholder from "@/components/ui/base/picture-placeholder";
export default {
  components: {PicturePlaceholder, AdminIcon},
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      avatarDefault: lazyAvatar
    };
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
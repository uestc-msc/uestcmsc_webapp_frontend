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
        :lazy-src="lazyAvatar"
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
import {getUserDetail} from "@/api/user";
export default {
  components: {PicturePlaceholder, AdminIcon},
  props: {
    userId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      user: {},
      lazyAvatar
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

  async created() {
    let res = await getUserDetail(this.userId, true)
    this.user = res.data;
  }
}
</script>
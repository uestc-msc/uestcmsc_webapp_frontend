<template>
  <div>
    <span class="mb-0 pl-1 text-subtitle-2 font-weight-black text--primary">
    {{ title }}
    </span>

    <v-item-group
      class="mx-auto row row--dense"
      mandatory
    >
      <v-col
        v-for="item in items"
        :key="item.text"
        cols="6"
      >
            <v-card
              class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
              :color="item.active() ? 'primary' : `grey ${$vuetify.theme.dark ? 'darken' : 'lighten'}-3`"
              ripple
              rounded
              flat
              @click="item.callback"
            >
              {{ item.text }}
              <v-icon v-text="item.icon"/>
            </v-card>
      </v-col>
    </v-item-group>
  </div>
</template>

<script>
export default {

  data() {
    let that = this;
    return {
      title: '账户',
      itemsForNotAuthenticated: [
        {
          text: '登录',
          icon: 'mdi-login',
          active: () => that.$route.name === 'Login',
          callback() {
            that.$router.push({name: 'Login'});
            that.$emit('hide');
          }
        },
        {
          text: '注册',
          icon: 'mdi-account-plus',
          active: () => that.$route.name === 'Signup',
          callback() {
            that.$router.push({name: 'Signup'});
            that.$emit('hide');
          }
        },
      ],

      itemsForAuthenticated: [
        {
          text: '个人信息',
          icon: 'mdi-account',
          active: () => that.$route.name === 'UserDetail',
          callback() {
            that.$router.push({
              name: 'UserDetail',
              params: {userId: that.$store.state.profile.id}
            });
            that.$emit('hide');
          }
        },
        {
          text: '登出账号',
          icon: 'mdi-logout',
          active: () => that.$route.name === 'Logout',
          callback() {
            that.$router.push({name: 'Logout'});
            that.$emit('hide');
          },
        },
      ]
    };
  },

  computed: {
    items() {
      return this.$store.getters.isAuthenticated ? this.itemsForAuthenticated : this.itemsForNotAuthenticated;
    },
  },
}
</script>
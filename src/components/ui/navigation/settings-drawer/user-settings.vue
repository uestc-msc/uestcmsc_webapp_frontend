<template>
  <div>
    <span class="mb-0 pl-1 text-subtitle-2 font-weight-black text--primary">
    {{ title }}
    </span>

    <v-item-group
      v-model="internalValue"
      class="mx-auto row row--dense"
      mandatory
    >
      <v-col
        v-for="item in items"
        :key="item.text"
        cols="6"
      >
            <!--              :dark="!dark && active"-->
            <v-card
              class="v-card--group py-3 px-4 text-center position-relative cursor-pointer d-flex align-center justify-space-between"
              :color="`grey ${dark ? 'darken' : 'lighten'}-3`"
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
import SettingsGroup from "@/components/ui/navigation/settings-drawer/settings-groups";

export default {
  extends: SettingsGroup,

  data() {
    let that = this;
    return {
      title: '账户',
      itemsForNotAuthenticated: [
        {
          text: '登录',
          icon: 'mdi-login',
          callback() {
            that.$router.push({name: 'Login'});
            that.$emit('hide');
          }
        },
      ],
      itemsForAuthenticated: [
        {
          text: '个人信息',
          icon: 'mdi-account',
          callback() {
            console.log(that.$store.state.profile.id)
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
    internalValue: {
      set(val) {
        const set = this.items.find(item => item.text === val)
        set.callback()
      }
    }
  },

  activated() {
    this.internalValue = -1;
  }
}
</script>
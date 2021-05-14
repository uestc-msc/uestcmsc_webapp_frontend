<template>
  <SimpleCard ripple>
    <v-card-title>屏幕宽高</v-card-title>
    <v-card-text>
      宽：{{$vuetify.breakpoint.width}}<br>
      高：{{$vuetify.breakpoint.height}}
    </v-card-text>
  </SimpleCard>
</template>

<script>
import SimpleCard from "@/components/ui/base/simple-card";
export default {
  components: {SimpleCard},
  activated() {
    this.$store.commit('setTitle', '调试信息');
  },

  deactivated() {
    this.$store.commit('clearTitle');
  }
}
</script>
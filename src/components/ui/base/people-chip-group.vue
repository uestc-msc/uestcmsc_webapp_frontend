<!--  封装好的 UserChipGroup  -->
<template>
  <v-chip-group
    :class=" listitem ? 'chip-group-in-list' :'' "
    column
  >
    <PeopleChip
      v-for="user in users"
      :key="user.id"
      :user="user"
    />
  </v-chip-group>
</template>

<style scoped>
/* TODO: 我爬了 两个场景上下对不齐也太难顶了 */
/* https://vue-loader.vuejs.org/zh/guide/scoped-css.html#深度作用选择器 */
.chip-group-in-list >>> .v-slide-group__content {
  padding: 0;
}

.chip-group-in-list >>> .v-chip {
  margin: 0 8px 0 0;
}
</style>

<script>
import PeopleChip from "@/components/ui/base/people-chip";
export default {
  components: {PeopleChip},
  props: {
    users: {
      type: Array,
      required: true
    },
    listitem: {
      type: Boolean,
      default: false
    }
  }
}
</script>
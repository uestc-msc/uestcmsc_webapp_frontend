<!--  封装好的 UserChipGroup  -->
<template>
  <v-chip-group
    class="people-chip-group"
    :class="listitem ? 'people-chip-group-as-list-item' : ''"
    column
  >
    <PeopleChip
      v-for="id in userId"
      :key="id"
      :userId="id"
    />
  </v-chip-group>
</template>

<style scoped>
/* https://vue-loader.vuejs.org/zh/guide/scoped-css.html#深度作用选择器 */
.people-chip-group >>> .v-slide-group__content {
  padding: 0;
}

.people-chip-group >>> .v-chip {
  margin: 2px 8px 2px 0;
}

/* 在 list-item 里的 chip-group，其 margin-top 应当对齐 list-item 的 padding-top */
.people-chip-group-as-list-item >>> .v-chip {
  margin: 0 8px 2px 0;
}
</style>

<script>
import PeopleChip from "@/components/ui/user/people-chip";
export default {
  components: {PeopleChip},
  props: {
    userId: {
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
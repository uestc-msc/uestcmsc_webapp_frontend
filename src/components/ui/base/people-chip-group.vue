<!--  封装好的 UserChipGroup  -->
<template>
  <v-chip-group column>
    <PeopleChip
      v-for="user in users"
      :key="user.id"
      :user="user"
    />
  </v-chip-group>
</template>

<script>
import PeopleChip from "@/components/ui/base/people-chip";
export default {
  components: {PeopleChip},
  props: {
    users: {
      type: Array,
      required: true
    }
  }
}
</script>
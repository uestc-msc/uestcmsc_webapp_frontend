<template>
  <SimpleCard>
    <v-row>
      <v-col>
        <PeopleSelector
          v-model="presenterList"
          label="选择主讲人 *"
          prepend-icon="mdi-account"
        />
      </v-col>
    </v-row>
  </SimpleCard>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";

export default {
  components: {SimpleCard, PeopleSelector},
  data() {
    return {
      presenterList: []
    }
  },

  activated() {
  }
}
</script>
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

<!--    <v-row>-->
<!--      <v-col>-->
<!--        <FileUploader/>-->
<!--      </v-col>-->
<!--    </v-row>-->
  </SimpleCard>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";
import FileUploader from "@/components/ui/file/file-uploader";

export default {
  components: {FileUploader, SimpleCard, PeopleSelector},
  data() {
    return {
      presenterArray: []
    }
  },

  activated() {
  }
}
</script>
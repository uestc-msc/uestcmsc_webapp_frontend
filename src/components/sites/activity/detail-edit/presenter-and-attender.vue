<template>
  <!--  已经上传/正在上传的文件  -->
  <!--  TODO: :key -->
  <v-form>
    <v-col>
      <PeopleSelector
        v-model="presenterList"
        label="选择主讲人 *"
        prepend-icon="mdi-account"
      />
    </v-col>
  </v-form>
</template>

<script>
import PeopleSelector from "@/components/ui/user/people-selector";
import SimpleCard from "@/components/ui/base/simple-card";
import FileUploader from "@/components/ui/file/file-uploader";

export default {
  components: {FileUploader, SimpleCard, PeopleSelector},
  data() {
    return {
      presenterList: []
    }
  },

  activated() {
  }
}
</script>ipt>
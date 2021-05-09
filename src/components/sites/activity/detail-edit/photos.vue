<template>
  <div>
    <ActivityGallery
      :activity-id="activity.id"
      :uploadQueue="uploadQueue"
    />
    <!--  隐藏了的文件上传栏，靠 toggleUploadPhoto 触发  -->
    <v-file-input
      v-model="uploadQueue"
      multiple
      accept="image/*"
      id="photoInput"
      style="display: none"
    />
  </div>
</template>

<script>
import {FileStatus, formatFileUploaderInput, uploadFileToOnedrive} from "@/utils/file";
import {Status, StatusColor} from "@/utils/status";
import {displayErrorTime, displaySuccessTime, sleep, totalRetryTimes} from "@/utils";
import {addActivityFile, addActivityPhoto} from "@/api/activity";
import ActivityGallery from "@/components/ui/photo/activity-gallery";

export default {
  components: {ActivityGallery},
  props: {
    activity: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toggleUploadPhoto: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      uploadQueue: [],
    }
  },

  // methods: {
  //   fetchData() {
  //
  //   },
  //
  //   updateData() {
  //   }
  // },

  watch: {
    // activity() {
    //   this.fetchData();
    // },

    toggleUploadPhoto() {
      const photoInput = document.getElementById('photoInput');
      photoInput.click();
    }
  },

  // created() {
  //   this.fetchData();
  // },
}
</script>
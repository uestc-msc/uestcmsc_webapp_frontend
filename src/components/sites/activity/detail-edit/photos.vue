<template>
  <ActivityGallery
    v-if="activity"
    :activity-id="activity.id"
    :toggle-upload-photo="toggleUploadPhoto"
  />
</template>

<script>
import ActivityGallery from "@/components/ui/photo/activity-gallery";

export default {
  components: {ActivityGallery},
  props: {
    activity: {
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
}
</script>
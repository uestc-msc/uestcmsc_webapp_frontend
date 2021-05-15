<template>
  <ActivityGallery
    v-if="activity"
    :activity-id="activity.id"
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
  },
}
</script>
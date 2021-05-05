<template>
</template>

<script>
export default {
  methods: {
    updateData() {   // 根据 activity 更新 linkArray
      // this.linkArray = this.activity.link.map(info => new Link(info));
    },

    updateActivity() {   // 根据 linkArray 更新 activity
      // let new_activity = {...this.activity};
      // new_activity.link = this.linkArray.map(status => status.info);
      // this.$emit('update', new_activity);
    }
  },

  watch: {
    activity() {
      this.updateData();
    }
  },

  created() {
    this.updateData();
  },
};
</script>
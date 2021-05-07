<template>
  <form>
    <v-text-field
    append-icon="mdi-book-open-page-variant"
    v-mode="title"
    label="主题"
    />

    
  </form>
</template>

<script>
export default {
  props: {
    activity: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      title: '',
      datetime: '',
      location: '',
      check_in_open: false,
    }
  },

  methods: {
    updateData() {   // 根据 activity 更新 data
      this.title = this.activity.title;
      this.datetime = this.activity.datetime;
      this.location = this.activity.location;
      this.check_in_open = this.activity.check_in_open;
    },

    updateActivity() {   // 根据 data 更新 activity
      let new_activity = {...this.activity};
      new_activity.title = this.title;
      new_activity.datetime = this.datetime;
      new_activity.location = this.location;
      new_activity.check_in_open = this.check_in_open;
      this.$emit('update', new_activity);
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
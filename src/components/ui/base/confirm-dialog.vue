<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="slotProps">
        <slot name="activator" v-bind="slotProps">
        <!--  这样写 slot 才能让父组件透过本组件获取到 v-dialog v-slot-activator 提供的属性  -->
          <v-btn
            color="red lighten-2"
            dark
            v-bind="slotProps.attr"
            v-on="slotProps.on"
            @keydown.enter="confirm"
            @keydown.esc="cancel"
          >
            {{ operation }}
          </v-btn>
        </slot>
      </template>

      <v-card>
        <v-card-title>
          {{ tips }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="confirm"
          >
            确定<span class="key-prompt">(Enter)</span>
          </v-btn>

          <v-btn
            text
            color="primary"
            @click="cancel"
          >
            取消<span class="key-prompt">(Esc)</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/*todo 还能更小吗*/
.key-prompt {
  font-size: 12px !important;
  height: 6px;
}
</style>

<script>
export default {
  props: {
    operation: {
      type: String,
      default: '确定',
    },
    tips: {
      type: String,
      default: '您真的要删除吗？这是不可逆的喔！'
    }
  },

  data() {
    return {
      dialog: false
    };
  },

  methods: {
    confirm() {
      this.$emit('confirm');
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    },
  }
}
</script>
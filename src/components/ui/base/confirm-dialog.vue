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
          >
            {{ operation }}
          </v-btn>
        </slot>
      </template>

      <v-card>
        <v-card-title>
          {{ real_warning }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="error"
            @click="$emit('confirm'); dialog=false"
          >
            {{ operation }}
          </v-btn>

          <v-btn
            text
            @click="dialog = false"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    operation: {
      type: String,
      default: '删除',
    },
    warning: {
      type: String,
      default: null
    }
  },

  computed: {
    real_warning() {
      return this.warning || `您真的要${this.operation}吗？这是不可逆的喔！`;
    }
  },

  data() {
    return {
      dialog: false
    };
  }
}
</script>
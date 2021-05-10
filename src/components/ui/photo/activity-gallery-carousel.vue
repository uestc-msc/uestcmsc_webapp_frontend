<template>
  <v-dialog
    v-model="show"
    :overlay-opacity="xs ? 1 : 0.8"
    :fullscreen="xs"
  >
    <v-carousel v-model="carouselIndex">
      <v-carousel-item
        v-for="(photo, i) in photos"
        :key="photo.id"
      >
        <v-sheet
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div class="display-3">
              Slide {{ i + 1 }}
            </div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    photos: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true,
    },
    activity: {
      required: true,
    },
  },

  computed: {
    xs() {
      return this.$vuetify.breakpoint.xsOnly;
    },

    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },

    carouselIndex: {
      get() {
        return this.index;
      },
      set(val) {
        this.$emit('update:index', val);
      }
    }
  },
}
</script>
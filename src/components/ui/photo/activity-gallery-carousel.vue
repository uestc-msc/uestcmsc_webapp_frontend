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
        console.log('get show: ' + (this.index >= 0));
        return this.index >= 0;
      },
      set(val) {
        console.log('set show to ' + val);
        this.$emit('update:index', val ? 0 : -1);
      }
    },

    carouselIndex: {
      get() {
        console.log('get carouselIndex: ' + this.index);
        return this.index;
      },
      set(val) {
        console.log('set carouselIndex: ' + val);
        this.$emit('update:index', val);
      }
    }
  },
}
</script>
<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      屏幕宽高
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      宽：{{ $vuetify.breakpoint.width }}<br>
      高：{{ $vuetify.breakpoint.height }}
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "ScreenInfo",
}
</script>
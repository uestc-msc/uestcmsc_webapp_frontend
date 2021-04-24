<!-- 对于一个页面，二话不说先摆个 card -->
<template>
  <!-- 外层的 container、row、col 是为了限制 card 的布局 -->
  <v-container>
    <v-row class="justify-center">
      <v-col :xs="xs" :md="md">
        <v-card>
          <v-card-text>
            <slot/> <!--  这里会把调用 SimpleCard 处的 <SimpleCard> </SimpleCard> 之间的代码插入  -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  props: {
    xs: {
      type: Number | String,
      default: 12
    },
    md: {
      type: Number | String,
      default: 8
    }
  }
};
</script>
<!-- 外层的 container、row、col 是为了限制 card 的布局 -->
<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xs="12" md="8">
        <v-card>
          <v-card-text>
            <slot/> <!--  这里会把调用 simple-card 的 <simple-card> </simple-card> 之间的代码插入  -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
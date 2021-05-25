<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      近期的错误请求
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <template v-for="(response, i) in $store.state.recentErrorRequests">
        <v-divider v-if="i"/>
        <v-card-text>
          路径: {{ response.config.url }}<br>
          状态码: {{ response.status }}<br>
          数据: {{ response.data }}<br>
          请求：<code class="code">{{ response.config }}</code>
        </v-card-text>
      </template>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "RecentErrorRequests",
}
</script>

<style scoped>

</style>
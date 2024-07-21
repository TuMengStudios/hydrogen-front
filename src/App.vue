<script setup lang="ts">
</script>

<template>
  <div class="nav-bar">
    <router-link class="tab-nav" to="/tasklist">tasklist</router-link>
    <router-link class="tab-nav" to="/config">config</router-link>
  </div>
  <router-view></router-view>
</template>

<style lang="css" scoped>
.nav-bar {
  margin: 0 auto;
  font-size: 24px;
  font-family: 'Courier New', Courier, monospace;
  padding: 4px;
}

.tab-nav {
  margin-right: 16px;
  font-size: 20px;
  font-family: sans-serif;
}
</style>

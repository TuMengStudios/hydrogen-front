<script setup lang="ts">
const start = () => {
  console.log("welcome");
};
start();
</script>

<template>
  <p>
    <router-link class="tab-nav" to="/">task list</router-link>
    <router-link class="tab-nav" to="/debug">调试作业</router-link>
    <router-link class="tab-nav" to="/counter">counter</router-link>
  </p>
  <router-view></router-view>
</template>

<style lang="css" scoped>
.tab-nav {
  margin-right: 16px;
  font-size: 20px;
  font-family: sans-serif;
}
</style>

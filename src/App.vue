<script setup lang="ts">
import { onMounted } from 'vue';
import { get } from '@/api/request'

const start = () => {
  get<number>('/health').then((res) => {
    console.log(`health response ${res.data}`)
  })
};

onMounted(() => {
  start();
})
</script>

<template>
  <p>
    <!-- <router-link class="tab-nav" to="/demo">demo page</router-link> -->
    <router-link class="tab-nav" to="/">demo page</router-link>
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

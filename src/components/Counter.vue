<template>
  <div>{{ store.count }}</div>
  <div class="color-blue" @click="add">继续加 {{ getCurrentInstance()?.appContext.app.config.globalProperties.$abc }}</div>
</template>
<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";
import { getCurrentInstance } from "vue";

let store = useCounterStore();
const add = () => {
  store.increment();
};
</script>

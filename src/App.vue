<script setup lang="ts">
import { TabPaneName } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();

// 页面导航
const pageChange = (name: TabPaneName) => {
  console.log("page change ", name);
  router.push({ path: `/${name}` })
}

</script>

<template>

  <el-tabs class="title-bar text-30 " @tab-change="pageChange">
    <el-tab-pane class="" label="task list" name="tasklist">
    </el-tab-pane>
    <el-tab-pane label="config" name="config">
    </el-tab-pane>
  </el-tabs>
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

.title-bar {
  margin: 16px;
}
</style>

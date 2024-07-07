<template>
  <div class="item-container">
    <div v-if="debugNode.property_type === 'object'">
      <div>
        <span>{{ debugNode.name }}</span>
        <span>对象</span>
        <span>
          <el-radio-group v-model="option_op" class="ml-4">
            <el-radio :label="Ignore" size="large">忽略</el-radio>
            <el-radio :label="Fold" size="large">折叠</el-radio>
            <el-radio :label="Normal" size="large">保留</el-radio>
          </el-radio-group>
        </span>
      </div>
    </div>
    <div v-else-if="debugNode.property_type === 'array'">
      <div>
        <span>{{ debugNode.name }}</span>
        <span>数组</span>
        <span>
          <el-radio-group v-model="option_op" class="ml-4">
            <el-radio :label="Ignore" size="large">忽略</el-radio>
            <el-radio :label="Fold" size="large">折叠</el-radio>
            <el-radio :label="Normal" size="large">保留</el-radio>
          </el-radio-group>
        </span>
      </div>
    </div>
    <div v-else>
      <div>
        <span>{{ debugNode.name }}</span>
        <span>
          <el-radio-group v-model="option_op" class="ml-4">
            <el-radio :label="Ignore" size="large">忽略</el-radio>
            <el-radio :label="Normal" size="large">保留</el-radio>
          </el-radio-group>
        </span>
      </div>
    </div>
    <div v-if="debugNode.op == 'normal'">
      <div v-if="debugNode.property_type === 'array' || debugNode.property_type === 'object'">
        <div v-for="(item, index) in debugNode.props" :key="index">
          <div class="item">
            <span>{{ item.name }}</span> - <span>{{ item.property_type }}</span>
            <el-radio-group v-model="item.op" class="ml-4">
              <el-radio :label="Ignore" size="large">忽略</el-radio>
              <el-radio :label="Fold" size="large">折叠</el-radio>
              <el-radio :label="Normal" size="large">保留</el-radio>
            </el-radio-group>
          </div>
          <div v-if="item.op == 'normal'">
            <div v-for="(subNode, subIndex) in item.props" :key="subIndex">
              <DebugItem :debug-node="subNode"></DebugItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";

import { DebugTaskResponse, Normal, Fold, Ignore } from "@/components/task/DebugTask";

let props = defineProps<{ debugNode: DebugTaskResponse }>();
onMounted(() => {
  console.log("debugNode ", props.debugNode);
});

// 一个计算属性 ref
const option_op = computed(() => {
  return props.debugNode.op;
});
</script>

<style lang="css" scoped>
.item-container {
  margin-left: 12px;
}

.item {
  margin-left: 12px;
}
</style>

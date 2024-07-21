<template>
  <div class="item-container"
    v-if="item !== undefined && item.node_name !== undefined && item.value_type !== undefined">
    <!-- display node_name -->
    <div class="item">{{ item.node_name }}</div>
    <!-- display symbol -->
    <div class="item" v-if="item.value_type === ObjectType">
      <span class="iconfont">&#xe65d;</span>
      <!-- <span>op:</span> -->
      <!-- <el-radio-group v-model="item.op">
        <el-radio :label="Keep">keep</el-radio>
        <el-radio :label="Fold">fold</el-radio>
        <el-radio :label="Ignore">ignore</el-radio>
      </el-radio-group> -->

    </div>
    <div class="item" v-else-if="item.value_type === ArrayType">
      <span class="iconfont">&#xe7e1;</span>

      <!-- <el-radio-group v-model="item.op">
        <el-radio :label="Keep">keep</el-radio>
        <el-radio :label="Fold">fold</el-radio>
        <el-radio :label="Ignore">ignore</el-radio>
      </el-radio-group> -->

    </div>
    <!-- 基础类型 字符串，布尔 null -->
    <div class="item"
      v-else-if="item.value_type === StringType || item.value_type === NumberType || item.value_type === BooleanType || item.value_type === NullType">
      <span v-if="item.value_type === StringType" class="iconfont">&#xe809;</span>
      <span v-else-if="item.value_type === NumberType" class="iconfont">&#xe660;</span>
      <span v-else-if="item.value_type === BooleanType" class="iconfont">&#xe618;</span>
      <span v-else class="iconfont">&#xe616;</span>
      <!-- 基础类型只有忽略和保留 -->
    </div>
    <div class="item" v-if="item.value_type === ObjectType || item.value_type == ArrayType">
      <el-radio-group v-model="item.op" @change="opChange">
        <el-radio :label="Keep">keep</el-radio>
        <el-radio :label="Fold">fold</el-radio>
        <el-radio :label="Ignore">ignore</el-radio>
      </el-radio-group>
    </div>
    <div class="item" v-else>
      <el-radio-group v-model="item.op" @change="opChange">
        <el-radio :label="Keep">keep</el-radio>
        <el-radio :label="Ignore">ignore</el-radio>
      </el-radio-group>
    </div>
  </div>
  <!-- 如果当前的项没有被折叠或者忽略都应该展开 -->
  <div class="sub-item" v-if="item !== undefined && item.props !== undefined && item.op == Keep"
    v-for="(item, index) in item.props" :key="index">
    <Item :item="item" @on_op_change="opChange"></Item>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance,defineEmits} from "vue";
import {
  ArrayType,
  BooleanType,
  Ignore,
  Keep,
  NumberType,
  ObjectType,
  PropertyItem,
  StringType,
  Fold,
  NullType
} from "./types";
//
const $emit = defineEmits(['on_op_change']);
const props = defineProps<{ item: PropertyItem }>();
const { appContext } = getCurrentInstance()!;
console.log('props ', props);

const opChange = (val:any)=>{
  console.log('op change ',val);
  $emit('on_op_change',{});
}
</script>
<style lang="css" scoped>
.item {
  margin-left: 12px;
}

.item-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 16px;
}

.sub-item {
  margin-left: 16px;
}
</style>

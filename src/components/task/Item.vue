<template>
  <div class="item-container"
    v-if="item !== undefined && item.node_name !== undefined && item.value_type !== undefined">
    <!-- display node_name -->
    <div class="item" v-if="item.node_name">{{ item.node_name }}</div>
    <el-tooltip v-else="!item.node_name" class="item box-item" effect="dark" content="empty key name"
      placement="bottom">
      <div>
        <icon icon="carbon:subtract-large" :size="23" color="black" />

      </div>
    </el-tooltip>

    <div class="item" v-if="item.value_type === ObjectType">
      <el-tooltip placement="right-start" class="box-item" effect="dark" content="object">
        <Icon icon="material-symbols:data-object" :size="23" color="black"></Icon>
      </el-tooltip>
    </div>
    <div class="item" v-else-if="item.value_type === ArrayType">
      <el-tooltip class="item-box" effect="dark" content="array" placement="right-start">
        <Icon icon="material-symbols:data-array-rounded" :size="23" color="black" />
      </el-tooltip>
    </div>
    <!-- 基础类型 字符串，布尔 null -->
    <div class="item"
      v-else-if="item.value_type === StringType || item.value_type === NumberType || item.value_type === BooleanType || item.value_type === NullType">
      <span v-if="item.value_type === StringType">
        <el-tooltip class="box-item" content="string" placement="right-start">
          <Icon icon="carbon:string-text" :size="23" color="black"></Icon>
        </el-tooltip>
      </span>
      <span v-else-if="item.value_type === NumberType">
        <el-tooltip class="box-item" content="number" placement="right-start">
          <Icon icon="material-symbols:123" :size="23" color="black" />
        </el-tooltip>
      </span>
      <span v-else-if="item.value_type === BooleanType">
        <el-tooltip content="bool" class="box-item" placement="right-start">
          <Icon icon="carbon:boolean" :size="23" color="black"></Icon>
        </el-tooltip>
      </span>
      <span v-else>
        <el-tooltip content="null" placement="right-start" class="box-item">
          <Icon icon="oui:token-null" :size="23" color="black"></Icon>
        </el-tooltip>
      </span>
      <!-- 基础类型只有忽略和保留 -->
    </div>
    <div class="item" v-if="item.value_type === ObjectType || item.value_type == ArrayType">
      <el-radio-group v-model="item.op" @change="opChange">
        <el-tooltip :content="tipKeep(item)" placement="right-start">
          <el-radio :label="Keep">keep</el-radio>
        </el-tooltip>
        <el-tooltip :content="tipFold(item)" placement="right-start">
          <el-radio :label="Fold">fold</el-radio>
        </el-tooltip>

        <el-tooltip :content="tipIgnore(item)" placement="right-start">
          <el-radio :label="Ignore">ignore</el-radio>
        </el-tooltip>
      </el-radio-group>
    </div>
    <div class="item" v-else>
      <el-radio-group v-model="item.op" @change="opChange">
        <el-tooltip :content="tipKeep(item)" placement="right-start">
          <el-radio :label="Keep">keep</el-radio>
        </el-tooltip>
        <el-tooltip :content="tipIgnore(item)" placement="right-start">
          <el-radio :label="Ignore">ignore</el-radio>
        </el-tooltip>
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
import { Icon } from "@iconify/vue";
import { getCurrentInstance } from "vue";
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
// console.log('props ', props);
const tipFold = (item: PropertyItem): string => {
  return `fold ${item.node_name}, type:${item.value_type}`;
};

const tipIgnore = (item: PropertyItem): string => {
  return `ignore ${item.node_name}, type:${item.value_type}`;
}

const tipKeep = (item: PropertyItem): string => {
  return `keep ${item.node_name}, type:${item.value_type}`;
}

const opChange = (val: any) => {
  // console.log('op change ', val);
  $emit('on_op_change', {});
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

.box-item {
  width: 110px;
  margin-top: 10px;
}
</style>

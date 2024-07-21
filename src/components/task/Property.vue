<template>
  <div>
    <el-input class="dt-container" clearable v-model="data.plain_text" autosize :rows="5" type="textarea"
      placeholder="Please input" @change="on_debug_text" />
    <el-button @click="debug_property">parser property</el-button>
    <el-button @click="fold_text">fold</el-button>
    <el-button @click="wrap_text">wrap</el-button>
    <el-button @click="compute_key_wrap">computed</el-button>
    <el-button @click="compute_fold_wrap">fold</el-button>
    <el-button @click="compute_ignore_wrap">ignore</el-button>
    <Item v-if="data.property !== undefined && data.property.item !== undefined" :item="data.property.item"></Item>
  </div>
</template>
<script setup lang="ts">

import { onMounted, reactive, ref, computed, getCurrentInstance } from "vue";
import { post } from "@/api/request";
import { Fold, Ignore, Keep, Property, PropertyItem, reset_property } from "./types";
import Item from "./Item.vue";
import { ElMessage } from "element-plus";
import { joinKey } from "./util";

const { appContext } = getCurrentInstance()!;
//

let data = reactive<{ plain_text: string, sep: string, property: Property }>({ 'plain_text': '[1]', 'sep': '_', property: {} as Property });
const parser_property = (sep: string, debug_text: any) => {
  //
  let body = { sep: sep, plain_text: debug_text }
  post<Property>("/debug/property", body = body).then(res => {
    console.log(res.data);
    data.property = res.data
    reset_property(data.property.item, Keep);
    if (res.err_no !== 10000) {
      //  error
    }
  }).catch(err => {

  });
}

//
const on_debug_text = (val: string) => {
  // ..
  console.log("debug text change", val);
};

console.log("new page");
const debug_property = () => {
  parser_property(data.sep, detected_plain_text(data.plain_text))
}

const fold_text = () => {
  data.plain_text = JSON.stringify(JSON.parse(data.plain_text));
}

const wrap_text = () => {
  data.plain_text = JSON.stringify(JSON.parse(data.plain_text), null, 4)
}



const compute_key = (item: PropertyItem, pre_key: string, sep: string): Set<string> => {
  let res = new Set<string>();
  res.add(joinKey(pre_key, item.node_name, sep));
  let new_key = joinKey(pre_key, item.node_name, sep);
  for (let node of item.props) {
    let sub = compute_key(node, new_key, sep);
    for (let val of sub) {
      res.add(val);
    }
  }

  return res;
};


const compute_ignore = (item: PropertyItem, pre_key: string, sep: string): string[] => {
  let res: string[] = [];
  if (item.op === Ignore) {
    res.push(joinKey(pre_key, item.node_name, sep));
    return res;
  }
  let new_key = joinKey(pre_key, item.node_name, sep);

  for (let node of item.props) {
    let sub = compute_ignore(node, new_key, sep);
    for (let v of sub) {
      res.push(v);
    }
  }

  return res;
}

const compute_fold = (item: PropertyItem, pre_key: string, sep: string): string[] => {
  let res: string[] = [];
  if (item.op === Fold) {
    res.push(joinKey(pre_key, item.node_name, sep));
    return res;
  }
  let new_key = joinKey(pre_key, item.node_name, sep);

  for (let node of item.props) {
    let sub = compute_fold(node, new_key, sep);
    for (let v of sub) {
      res.push(v);
    }
  }

  return res;
}

const compute_key_wrap = () => {
  let keys = compute_key(data.property.item, '', data.sep);
  console.log('keys ', keys)
}

const compute_ignore_wrap = () => {
  let ignore = compute_ignore(data.property.item, '', data.sep);
  console.log('ignore == ', ignore)
}
const compute_fold_wrap = () => {
  let fold = compute_fold(data.property.item, '', data.sep);
  console.log('fold == ', fold)
}
onMounted(() => {
  let val = JSON.parse(data.plain_text)
  parser_property(data.sep, val)
});

const detected_plain_text = (plain_text: string): any => {
  try {
    let obj = JSON.parse(plain_text);
    return obj;
  } catch (err) {
    ElMessage({ message: `${err}`, type: 'error' }, appContext);
  }
}
</script>
<style lang="css" scoped>
.dt-container {
  width: 100vw;
  padding-left: 32px;
  padding-right: 32px;
}
</style>

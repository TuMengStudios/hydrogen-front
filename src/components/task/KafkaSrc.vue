<template>
  <div class="data-source-title">
    <span>kafka data source config</span>
  </div>
  <div class="config-box">
    <span>connect params</span>
    <el-input placeholder="bootstrap.servers=localhost:9092,127.0.0.1:9092&message.timeout.ms=5000"
      v-model="source_config.params" :autosize="{ minRows: 3 }" :rows="5" type="textarea"></el-input>
    <el-button @click="fetch_topic">topic</el-button>
  </div>
  <!-- select topic from source broker -->
  <el-select v-model="source_config.topic">
    <el-option v-for="(tp, index) in topics" :key="index" :label="tp" :value="tp"></el-option>
  </el-select>
</template>

<script setup lang="ts">

import { getCurrentInstance, reactive, ref } from "vue";
import { SrcKafkaConfig } from "./types";
import { post, get } from '@/api/request';
import { ElMessage } from "element-plus";

import qs from 'qs';

const tplParams = "bootstrap.servers=localhost:9092&message.timeout.ms=5000";

const { appContext } = getCurrentInstance()!;

let prop = defineProps<{ source_config: SrcKafkaConfig }>();

prop.source_config.params = tplParams;
let topics = ref<string[]>([])

const fetch_topic = async () => {

  if (prop.source_config.params === undefined || prop.source_config.params === "") {
    ElMessage({ message: 'invalid kafka connect', type: 'error' }, appContext);
    return;
  }

  let topic_res = await post<string[]>("/kafka/topic", { params: prop.source_config.params.trim() });
  if (topic_res.err_no !== 10000) {
    ElMessage({ message: topic_res.err_msg, type: 'error' }, appContext);
    return;
  }

  topics.value = topic_res.data;

  if (prop.source_config.group_id === undefined || prop.source_config.group_id === "") {
    prop.source_config.group_id = (await get<string>("/kafka/next/group")).data;
  }
  console.log(prop.source_config)
};


</script>
<style lang="css" scoped>
/*  */
.data-source-title {
  padding-left: 16px;
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: 20px;
}

.config-box {
  margin-left: 32px;
  margin-right: 32px;
  margin-top: 4px;
  margin-bottom: 6px;
  font-size: 20px;
}
</style>

<template>
  <div class="config-box">
    <el-input
      placeholder="kafka consumer params etc:bootstrap.servers=localhost:9092,127.0.0.1:9092&message.timeout.ms=5000"
      v-model="source_config.params" :autosize="{ minRows: 3 }" :rows="5" type="textarea"></el-input>
  </div>
  <div v-if="source_config.params" class="topic-check-container">
    <el-button @click="fetch_topic"  size="default">fetch topic</el-button>
    <el-select v-if="topics" v-model="source_config.topic">
      <el-option v-for="(topic, index) in topics" :key="index" :label="topic" :value="topic"></el-option>
    </el-select>
  </div>

</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import { ElMessage } from "element-plus";

import { SrcKafkaConfig } from "./types";
import { post, get } from '@/api/request';

const { appContext } = getCurrentInstance()!;

let prop = defineProps<{ source_config: SrcKafkaConfig }>();

let topics = ref<string[]>([])

const fetch_topic = async (): Promise<void> => {
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
  display: flex;
  align-items: center;
}

.config-box {
  display: flex;
  align-items: center;
}

.topic-check-container {
  display: flex;
  align-items: center;
}
</style>

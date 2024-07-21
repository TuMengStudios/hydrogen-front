<template>
  <div>
    <span>kafka sink</span>
    <div class="params-box">
      <el-input v-model="prop.dst_config.params"
        placeholder="bootstrap.servers=localhost:9092,127.0.0.1:9092&message.timeout.ms=5000" type="textarea"
        :autosize="{ minRows: 3 }" :rows="5">
      </el-input>
      <el-input placeholder="dst topic" v-model="prop.dst_config.topic"></el-input>
    </div>
    <span>
      <el-button @click="check_kafka">
        check
      </el-button>
    </span>
  </div>
</template>
<script setup lang="ts">

import { DstKafkaConfig } from "./types";
import { post } from "@/api/request";
import { ElMessage } from "element-plus";

let prop = defineProps<{ dst_config: DstKafkaConfig }>();

const check_kafka = async () => {
  let res = await post("/kafka/check", { params: prop.dst_config.params })
  console.log(res);
  if (res.err_no != 10000) {
    ElMessage({ message: res.err_msg, type: 'error' });
    return;
  } else {
    ElMessage({ message: res.err_msg, type: 'success' });
    return;
  }
}
</script>

<style lang="css" scoped>
.params-box {
  margin: 16px;
}
</style>

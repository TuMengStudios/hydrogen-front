<template>
  <div>
    <div class="params-box">
      <el-input v-model="prop.dst_config.params"
        placeholder="kafka producer param etc:bootstrap.servers=localhost:9092,127.0.0.1:9092&message.timeout.ms=5000"
        type="textarea" :autosize="{ minRows: 3 }" :rows="5">
      </el-input>
      <el-input placeholder="dst topic" v-model="prop.dst_config.topic">
        <template #prepend><span>dst topic</span></template>
      </el-input>
    </div>
  </div>
</template>
<script setup lang="ts">

import { DstKafkaConfig } from "./types";

let prop = defineProps<{ dst_config: DstKafkaConfig }>();

</script>

<style lang="css" scoped></style>

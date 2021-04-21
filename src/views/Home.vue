<template>
  <div class="home">
    <a-form layout="inline" :model="qa" :style="{ marginTop: '30px' }">
      <a-form-item>
        <a-input
          v-model:value="qa.question"
          placeholder="请输入要查询的问题"
          :allowClear="true"
          :style="{ width: '300px' }"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          :disabled="qa.question === ''"
          @click="submitQuestion"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
    <Process
      v-if="processVisible"
      :participle="participle"
      :template="template"
      :matchResult="matchResult"
    ></Process>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { onMounted, reactive, UnwrapRef, ref, defineComponent } from "vue";
import axios from "../utils/request";
import process from "../components/process.vue";

const config = require("../../public/config.json");
interface QA {
  question: string;
}
export default defineComponent({
  name: "Home",
  components: {
    Process: process,
  },
  setup() {
    const qa: UnwrapRef<QA> = reactive({
      question: "",
    });
    const participle = ref<string>("");
    const template = ref<string>("");
    const matchResult = ref<string>("");
    const processVisible = ref(false);
    const submitQuestion = () => {
      processVisible.value = false;
      axios
        .post(config.url + "/templateMatch", { question: qa.question })
        .then((response) => {
          participle.value = response.data[0];
          template.value = response.data[1];
          matchResult.value = response.data[2];
          processVisible.value = true;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      qa,
      submitQuestion,
      participle,
      template,
      matchResult,
      processVisible,
    };
  },
});
</script>

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
      :question="qa.question"
      :participle="participle"
      :template="template"
      :matchResult="matchResult"
      :vertexlabels="vertexlabels"
      :edgelabels="edgelabels"
    ></Process>
    <div :style="{ position: 'fixed', left: '10px', bottom: '10px',display:'block' }">
    <a-upload
    :style="{display:'block'}"
      v-model:file-list="fileList"
      name="file"
      :multiple="true"
      :action="uploadUrl"
      @change="handleChange"
      :showUploadList="false"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        数据导入
      </a-button>
    </a-upload>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { onMounted, reactive, UnwrapRef, ref, defineComponent } from "vue";
import axios from "../utils/request";
import process from "../components/process.vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue'
const config = require("../../public/config.json");
interface QA {
  question: string;
}
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
export default defineComponent({
  name: "Home",
  components: {
    Process: process,
    UploadOutlined,
  },
  setup() {
    const qa: UnwrapRef<QA> = reactive({
      question: "",
    });
    // 问题处理
    const participle = ref<string>("");
    const template = ref<string>("");
    const matchResult = ref<string>("");
    const processVisible = ref<boolean>(false);
    const submitQuestion = () => {
      processVisible.value = false;
      axios
        .post("/templateMatch", { question: qa.question })
        .then((response) => {
          participle.value = response.data[0];
          template.value = response.data[1];
          matchResult.value = response.data[2];
          processVisible.value = true;
          // 匹配到了模板
          if (matchResult.value !== "None") {
          } else {
            // 没有匹配到模板允许自动添加进模板库
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // 加载图数据
    let vertexlabels = ref<Array<Object>>();
    let edgelabels = ref<Array<Object>>();
    onMounted(() => {
      axios.defaults.baseURL = config.url;
      axios
        .get("/loadEntityPropertyLabel")
        .then((response) => {
          vertexlabels.value = [];
          for (var i = 0; i < response.data.length; i++) {
            vertexlabels.value.push({
              key: response.data[i].entity.name,
              name: response.data[i].entity.name,
              standardName: response.data[i].entity.standardName,
              aliases: response.data[i].entity.aliases,
              properties: response.data[i].property,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      axios
        .get("/loadRelationLabel")
        .then((response) => {
          edgelabels.value = [];
          for (var i = 0; i < response.data.length; i++) {
            edgelabels.value.push({
              key: response.data[i].name,
              name: response.data[i].name,
              standardName: response.data[i].standardName,
              aliases: response.data[i].aliases,
              source_name: response.data[i].source_name,
              target_name: response.data[i].target_name,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });


    // 导入文件
    const handleChange = (info: FileInfo) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    const fileList = ref([]);
    const uploadUrl = ref<string>(config.url+"/addTemplate")
    return {
      // 问题处理
      qa,
      submitQuestion,
      participle,
      template,
      matchResult,
      processVisible,
      vertexlabels,
      edgelabels,

      // 导入文件
      fileList,
      handleChange,
      uploadUrl
    };
  },
});
</script>

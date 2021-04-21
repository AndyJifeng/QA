<template>
  <div id="process">
    <div :style="{display:'inline-block',textAlign:'left'}"> 
      <div class="lineStyle">
        分词结果： <span class="contentStyle">{{ participle1 }}</span>
      </div>
      <div class="lineStyle">
        匹配模板： <span class="contentStyle">{{ template1 }}</span>
      </div>
      <div class="lineStyle">
        匹配结果： <span class="contentStyle">{{ matchResult1 }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "process",
  props: {
    participle: String,
    template: String,
    matchResult: String,
  },
  setup(props) {
    const participle1 = ref(props.participle);
    const template1 = ref(props.template);
    const matchResult1 = ref(props.matchResult);
    return { participle1, template1, matchResult1 };
  },
});
</script>>


<style>
#process {
  width: 80%;
  min-height: 100px;
  border-bottom: 1px solid #dcdfe6;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
  text-align: left;
  font-size: 12px;
  font-family: "黑体";
  line-height: 20px;
  text-align: center;
  padding-top: 10px;
}
.contentStyle {
  margin-left: 2px;
  font-size: 17px;
  font-family: "宋体";
}
.lineStyle {
  font-family: "微软雅黑", "Heiti SC", "文泉驿正黑体", "黑体", "Sans-serif";
  font-size: 16px;
  margin-top: 6px;
}
</style>
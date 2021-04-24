<template>
  <div id="process">
    <div :style="{ display: 'inline-block', textAlign: 'left' }">
      <div class="lineStyle">
        分词结果： <span class="contentStyle">{{ participle1 }}</span>
      </div>
      <div class="lineStyle">
        匹配模板： <span class="contentStyle">{{ template1 }}</span>
      </div>
      <div class="lineStyle">
        匹配结果： <span class="contentStyle">{{ matchResult1 }}</span>
        <a
          v-if="isNotMatched"
          @click="insertTemplateModelVision = true;insertedTemplate = question1"
          :style="{ fontSize: '10px', marginLeft: '10px' }"
          >点击将匹配模板添加进模板库</a
        >
      </div>
    </div>
  </div>
  <a-modal
    :visible="insertTemplateModelVision"
    @ok="insertTemplate"
    width="50%"
    @cancel="insertTemplateModelVision = false"
  >
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="模板类型">
        <a-radio-group
          v-model:value="templateSpiecesValue"
          @change="templateSpiecesOnChange"
        >
          <a-radio :value="1"> 单实体模板 </a-radio>
          <a-radio :value="2"> 单跳模板 </a-radio>
          <a-radio :value="3"> 多跳模板 </a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="index === 1">
        <a-form-item label="选择实体">
          <a-select
            placeholder="Please input your entity"
            v-model:value="selectedSingleEntityCascaderEntity"
            @select="handleSingleEntityCascaderEntityChange"
          >
            <a-select-option
              v-for="entity in singleEntityCascaderEntity"
              :key="entity"
            >
              {{ entity }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择属性">
          <a-select
            placeholder="Please input your property"
            v-model:value="selectedSingleEntityCascaderProperty"
          >
            <a-select-option
              v-for="property in singleEntityCascaderProperty[
                selectedSingleEntityCascaderEntity
              ]"
              :key="property"
              :value="property"
            >
              {{ property }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template v-else-if="index === 2">
        <a-form-item label="选择实体1">
          <a-select
            placeholder="Please input your entity"
            v-model:value="selectedSingleJumpCascaderEntity1"
            @select="handleSingleJumpCascaderEntity1Change"
          >
            <a-select-option
              v-for="entity in singleJumpCascaderEntity1"
              :key="entity"
            >
              {{ entity }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择关系">
          <a-select
            placeholder="Please input your relation"
            v-model:value="selectedSingleJumpCascaderRelation"
            @select="handleSingleJumpCascaderRelationChange"
          >
            <a-select-option
              v-for="relation in singleJumpCascaderRelation[
                selectedSingleJumpCascaderEntity1
              ]"
              :key="relation"
            >
              {{ relation }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择实体2">
          <a-select
            placeholder="Please input your entity2"
            v-model:value="selectedSingleJumpCascaderEntity2"
            @select="handleSingleJumpCascaderEntity2Change"
          >
            <a-select-option
              v-for="entity2 in singleJumpCascaderEntity2[
                selectedSingleJumpCascaderRelation
              ]"
              :key="entity2"
            >
              {{ entity2 }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择属性">
          <a-select
            placeholder="Please input your property"
            v-model:value="selectedSingleJumpCascaderProperty"
          >
            <a-select-option
              v-for="property in singleJumpCascaderProperty[
                selectedSingleJumpCascaderEntity2
              ]"
              :key="property"
              :value="property"
            >
              {{ property }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template v-if="index === 1 || index === 2">
        <a-form-item label="选择问题类型">
          <a-select
            placeholder="Please input your question type"
            v-model:value="selectedQuestionType"
            style="width: 120px"
          >
            <a-select-option
              v-for="questionType in questionTypes"
              :key="questionType"
            >
              {{ questionType }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="输入模板">
          <a-input
            v-model:value="insertedTemplate"
            placeholder="Please input your template"
          />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
/* eslint-disable */
import axios from "axios";
import { ref, defineComponent, onMounted, reactive } from "vue";
import { message } from 'ant-design-vue'
export default defineComponent({
  name: "process",
  props: {
    question:String,
    participle: String,
    template: String,
    matchResult: String,
    vertexlabels: Array,
    edgelabels: Array,
  },
  setup(props) {
    // 问题处理结果
    const question1 = ref(props.question)
    const participle1 = ref(props.participle);
    const template1 = ref(props.template);
    const matchResult1 = ref(props.matchResult);

    // 添加单实体模板
    const singleEntityCascaderEntity = ref<Array<string>>([]);
    const selectedSingleEntityCascaderEntity = ref<string | any>();
    const handleSingleEntityCascaderEntityChange = () => {
      selectedSingleEntityCascaderProperty.value = singleEntityCascaderProperty[
       selectedSingleEntityCascaderEntity.value
      ][0];
    };
    const singleEntityCascaderProperty = reactive<object>({});
    const selectedSingleEntityCascaderProperty = ref<string>();
    const loadSingleEntityOptionsData = () => {
      if (singleEntityCascaderEntity.value.length === 0) {
        for (let i = 0; i < vertexlabels.value.length; i++) {
          let name: string = vertexlabels.value[i].name;
          singleEntityCascaderEntity.value.push(name);
          singleEntityCascaderProperty[name] = [];
          for (let j = 0; j < vertexlabels.value[i].properties.length; j++) {
            singleEntityCascaderProperty[name].push(
              vertexlabels.value[i].properties[j].name
            );
          }
        }
        selectedSingleEntityCascaderEntity.value = singleEntityCascaderEntity.value[0];
        selectedSingleEntityCascaderProperty.value =
          singleEntityCascaderProperty[singleEntityCascaderEntity.value[0]][0];
      }
    };
    // 添加单跳模板
    const singleJumpCascaderEntity1 = ref<Array<string>>([]);
    const selectedSingleJumpCascaderEntity1 = ref<string | any>();
    const handleSingleJumpCascaderEntity1Change = () => {
      let value:string = selectedSingleJumpCascaderEntity1.value
      if(typeof(singleJumpCascaderRelation[value]) !== 'undefined'){
        selectedSingleJumpCascaderRelation.value = singleJumpCascaderRelation[
          value
        ][0];
        selectedSingleJumpCascaderEntity2.value = singleJumpCascaderEntity2[selectedSingleJumpCascaderRelation.value][0]
        selectedSingleJumpCascaderProperty.value = singleJumpCascaderProperty[selectedSingleJumpCascaderEntity2.value][0]
      }
      else{
        selectedSingleJumpCascaderRelation.value = ""
        selectedSingleJumpCascaderEntity2.value = ""
        selectedSingleJumpCascaderProperty.value =""
      }
    };
    const singleJumpCascaderProperty = reactive<object>({});
    const selectedSingleJumpCascaderProperty = ref<string>();
    const singleJumpCascaderEntity2 = reactive<object>({});
    const selectedSingleJumpCascaderEntity2 = ref<string | any>();
    const handleSingleJumpCascaderEntity2Change = () => {
       selectedSingleJumpCascaderProperty.value = singleJumpCascaderProperty[
        selectedSingleJumpCascaderEntity2.value
      ][0];
    };
    const singleJumpCascaderRelation = reactive<object>({});
    const selectedSingleJumpCascaderRelation = ref<string | any>();
    const handleSingleJumpCascaderRelationChange = () => {
      selectedSingleJumpCascaderEntity2.value = singleJumpCascaderEntity2[
        selectedSingleJumpCascaderRelation.value
      ][0];
    };
    const vertexlabels = ref<Array<any> | any>(props.vertexlabels);
    const edgelabels = ref<Array<any> | any>(props.edgelabels);
    const loadSingleJumpOptionsData = () => {
      if (singleJumpCascaderEntity1.value.length === 0) {
        for (let i = 0; i < vertexlabels.value.length; i++) {
          let name: string = vertexlabels.value[i].name;
          singleJumpCascaderEntity1.value.push(name);
          singleJumpCascaderRelation[name] = [];
          for (let j = 0; j < edgelabels.value.length; j++) {
            if (edgelabels.value[j].source_name === name) {
              singleJumpCascaderRelation[name].push(edgelabels.value[j].name);
              singleJumpCascaderEntity2[edgelabels.value[j].name] = [
                edgelabels.value[j].target_name,
              ];
              // 从vertexlabels找到target_name,获取到属性
              for (let k = 0; k < vertexlabels.value.length; k++) {
                if (
                  vertexlabels.value[k].name === edgelabels.value[j].target_name
                ) {
                  // 遍历属性
                  singleJumpCascaderProperty[
                    edgelabels.value[j].target_name
                  ] = [];
                  for (
                    let q = 0;
                    q < vertexlabels.value[k].properties.length;
                    q++
                  ) {
                    singleJumpCascaderProperty[
                      edgelabels.value[j].target_name
                    ].push(vertexlabels.value[k].properties[q].name);
                  }
                  break;
                }
              }
            }
          }
          // 把没有关系的实体删除
          if (singleJumpCascaderRelation[name].length === 0) {
            delete singleJumpCascaderRelation[name];
          }
        }
         selectedSingleJumpCascaderEntity1.value = singleJumpCascaderEntity1.value[0];
        if(typeof(singleJumpCascaderRelation[selectedSingleJumpCascaderEntity1.value]) === 'undefined'){
          selectedSingleJumpCascaderEntity2.value  = ""
          selectedSingleJumpCascaderRelation.value  = ""
          selectedSingleJumpCascaderProperty.value = ""
          return
       }
 
        selectedSingleJumpCascaderRelation.value = singleJumpCascaderRelation[selectedSingleJumpCascaderEntity1.value][0];
        selectedSingleJumpCascaderEntity2.value = singleJumpCascaderEntity2[selectedSingleJumpCascaderRelation.value][0];
        selectedSingleJumpCascaderProperty.value = singleJumpCascaderProperty[selectedSingleJumpCascaderEntity2.value][0]
      }
    };
    const questionTypes = ref<Array<string>>([
      "查找实体",
      "查找属性",
      "比较问题",
      "统计问题",
      "判断问题",
    ]);
    const selectedQuestionType = ref<string>("查找实体");
    // 添加模板
    let templateSpiecesValue = ref<Number>(1);
    const templateSpiecesOnChange = () => {
      if (templateSpiecesValue.value === 1) {
        index.value = 1;
      } else if (templateSpiecesValue.value === 2) {
        index.value = 2;
      } else {
        index.value = 3;
      }
    };
    const insertTemplateModelVision = ref<boolean>(false);
    const isNotMatched = ref<boolean>(false);
    const index = ref<number>(1);
    const insertedTemplate = ref<string | any>();
    const insertTemplate = () => {
      let key = ref<string | any>("");
      if (index.value === 1) {
        key =
          selectedSingleEntityCascaderEntity.value +
          "-" +
          selectedSingleEntityCascaderProperty.value +
          "-" +
          selectedQuestionType.value;
          let data = ref<Array<Array<string>>>([])
          data.value[key] = ([insertedTemplate.value])
          axios.post('/addOneEntityTemplate',[data.value]).then((response) => {
            message.success("模板添加成功")
          }).catch((error) => {
            message.error("模板添加失败")
            console.log(error)
          })
      } else if (index.value === 2) {
        key =
          selectedSingleJumpCascaderEntity1.value +
          "-" +
          selectedSingleJumpCascaderRelation.value +
          "-" +
          selectedSingleJumpCascaderEntity2.value +
          "-" +
          selectedSingleJumpCascaderProperty.value +
          "-" +
          selectedQuestionType.value;
      }
      let data = ref<Array<string | Array<string>>>([])
          data[key] = [insertedTemplate.value]
          axios.post('/addTwoEntityTemplate',data).then((response) => {
            message.success("模板添加成功")
          }).catch((error) => {
            message.error("模板添加失败")
            console.log(error)
          })
      
    };

    onMounted(() => {
      // 匹配成功
      if (matchResult1.value !== "None") {
      } else {
        // 匹配失败
        isNotMatched.value = true;
        loadSingleEntityOptionsData()
        loadSingleJumpOptionsData()
      }
    });

    return {
      question1,
      participle1,
      template1,
      matchResult1,
      // 单实体模板
      singleEntityCascaderEntity,
      selectedSingleEntityCascaderEntity,
      handleSingleEntityCascaderEntityChange,
      singleEntityCascaderProperty,
      selectedSingleEntityCascaderProperty,
      // 单跳模板
      handleSingleJumpCascaderEntity1Change,
      singleJumpCascaderEntity1,
      selectedSingleJumpCascaderEntity1,
      handleSingleJumpCascaderEntity2Change,
      singleJumpCascaderEntity2,
      selectedSingleJumpCascaderEntity2,
      handleSingleJumpCascaderRelationChange,
      singleJumpCascaderRelation,
      selectedSingleJumpCascaderRelation,
      singleJumpCascaderProperty,
      selectedSingleJumpCascaderProperty,
      questionTypes,
      selectedQuestionType,
      // 添加模板
      loadSingleEntityOptionsData,
      loadSingleJumpOptionsData,
      templateSpiecesValue,
      templateSpiecesOnChange,
      insertedTemplate,
      insertTemplate,
      insertTemplateModelVision,
      isNotMatched,
      index,
    };
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
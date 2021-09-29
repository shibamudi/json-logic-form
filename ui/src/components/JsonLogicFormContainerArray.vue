<template>
  <div class="q-col-gutter-y-md">
    <div v-if="schema.title" class="text-subtitle2">{{ schema.title }}</div>
    <json-logic-form-container-array-item
      v-for="(item, index) in data"
      :key="item.__nodeId"
      :schema="schema"
      :model-value="item"
      :show-delete-btn="data.length > schema.min"
      @update:model-value="onUpdate($event, index)"
      @delete-item="onDeleteItem(index)"
    />
    <div>
      <q-btn
        v-if="!schema.max || data.length < schema.max"
        color="primary"
        label="增加"
        @click="onAddItem"
      />
    </div>
  </div>
</template>

<script>
import {
  defineComponent, inject, provide, reactive, readonly, ref, watch,
} from 'vue';
import { uid, QBtn } from 'quasar';
import JsonLogicFormContainerArrayItem from './JsonLogicFormContainerArrayItem';

export default defineComponent({
  name: 'JsonLogicFormContainerArray',
  components: { QBtn, JsonLogicFormContainerArrayItem },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array,
      default: () => ([]),
    },
    schema: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup(props, { emit }) {
    const defaultFieldAttrs = inject('defaultFieldAttrs', {});
    const attrs = reactive({
      ...defaultFieldAttrs,
      ...props.schema.attrs,
    });
    provide('defaultFieldAttrs', readonly(attrs));

    const data = ref([]);
    provide('arrayData', readonly(data));

    function fillArray(array, length, item) {
      const newArray = [...array];
      while (newArray.length < length) {
        newArray.push(item);
      }
      return newArray;
    }

    // 确保删除元素时，子元素模板正确重用，值不因子元素中的操作而发生混乱
    function fillArrayId(array, key = '__nodeId') {
      const newArray = [];
      array.forEach((e) => {
        const d = { ...e };
        if (!e[key]) {
          d[key] = uid();
        }
        newArray.push(d);
      });
      return newArray;
    }

    watch(
      () => props.modelValue,
      (val) => {
        const newData = [...val];
        data.value = fillArrayId(fillArray(newData, props.schema.min, {}));
      },
      {
        deep: true,
        immediate: true,
      },
    );

    const onUpdate = (val, index) => {
      const newData = [...data.value];
      newData[index] = val;
      emit('update:modelValue', newData);
    };

    const onAddItem = () => {
      const newData = [
        ...data.value,
        {},
      ];

      emit('update:modelValue', fillArrayId(newData));
    };

    const onDeleteItem = (index) => {
      const newData = [...data.value];
      newData.splice(index, 1);
      emit('update:modelValue', newData);
    };

    return {
      data,
      onUpdate,
      onAddItem,
      onDeleteItem,
    };
  },
});
</script>

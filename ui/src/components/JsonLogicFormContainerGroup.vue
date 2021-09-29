<template>
  <div class="q-col-gutter-y-md">
    <div v-if="schema.title" class="text-subtitle2">{{ schema.title }}</div>
    <div class="row q-col-gutter-md">
      <template v-for="(item, index) in schema.children" :key="index">
        <component
          :is="getContainer(item.type)"
          v-if="!applyLogic(item.hide)"
          :schema="item"
          :model-value="data[item.name]"
          @update:model-value="onUpdate($event, item.name)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import {
  defineComponent, inject, provide, reactive, readonly, watch,
} from 'vue';
import useJsonLogic from '../composables/use-json-logic';
import useContainer from '../composables/use-container';
import useDataResource from '../composables/use-data-resource';

export default defineComponent({
  name: 'JsonLogicFormContainerGroup',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
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
    const { getContainer } = useContainer();

    const defaultFieldAttrs = inject('defaultFieldAttrs', {});
    const attrs = reactive({
      ...defaultFieldAttrs,
      ...props.schema.attrs,
    });
    provide('defaultFieldAttrs', readonly(attrs));

    const data = reactive({});
    provide('groupData', readonly(data));

    const dataResource = useDataResource({
      groupData: data,
      defaultData: data,
    });
    const { applyLogic } = useJsonLogic(dataResource);

    watch(
      () => props.modelValue,
      (val) => {
        Object.keys({ ...val }).forEach((key) => {
          data[key] = val[key];
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    // 应对初始化时同时触发多个update事件的问题
    // TODO 暂时使用延时的方式处理，不太可控
    let updateTask = null;
    function update() {
      if (!updateTask) {
        updateTask = setTimeout(() => {
          // 表单值更新之后，检查隐藏逻辑规则，如果隐藏则删除对应值
          props.schema.children.forEach((item) => {
            if (applyLogic(item.hide)) {
              delete data[item.name];
            }
          });

          emit('update:modelValue', readonly(data));

          updateTask = null;
        }, 100);
      }
    }

    const onUpdate = (val, key) => {
      data[key] = val;

      update();
    };

    return {
      getContainer,
      applyLogic,
      data,
      onUpdate,
    };
  },
});
</script>

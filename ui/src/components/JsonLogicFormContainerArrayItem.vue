<template>
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
    <q-field v-if="showDeleteBtn">
      <template v-slot:before>
        <q-btn round color="warning" icon="close" @click="$emit('deleteItem')" />
      </template>
    </q-field>
  </div>
</template>

<script>
import {
  defineComponent, provide, reactive, readonly, watch,
} from 'vue';
import useJsonLogic from '../composables/use-json-logic';
import useContainer from '../composables/use-container';
import useDataResource from '../composables/use-data-resource';

export default defineComponent({
  name: 'JsonLogicFormContainerArrayItem',
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
    showDeleteBtn: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'update:modelValue',
    'deleteItem',
  ],
  setup(props, { emit }) {
    const { getContainer } = useContainer();

    const data = reactive({});
    provide('arrayItemData', readonly(data));

    const dataResource = useDataResource({
      arrayItemData: data,
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
      data,
      applyLogic,
      onUpdate,
    };
  },
});
</script>

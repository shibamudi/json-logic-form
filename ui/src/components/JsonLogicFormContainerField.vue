<template>
  <component
    :is="getComponent(schema.component)"
    v-bind="attrs"
    :rules="(schema.rules || []).map((i) => getRule(i))"
    :model-value="modelValue"
    @update:model-value="onUpdate"
  />
</template>

<script>
import {
  defineComponent, inject, reactive, toRefs, watch,
} from 'vue';
import useJsonLogic from '../composables/use-json-logic';
import useComponent from '../composables/use-component';
import useDataResource from '../composables/use-data-resource';
import useValidate from '../composables/use-validate';

export default defineComponent({
  name: 'JsonLogicFormContainerField',
  inheritAttrs: false,
  props: {
    modelValue: {},
    schema: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup(props, { emit }) {
    const customComponents = inject('customComponents', {});
    const { getComponent } = useComponent(customComponents);
    const customRules = inject('customRules', {});
    const { getRule } = useValidate(customRules);

    const { modelValue } = toRefs(props);

    const dataResource = useDataResource({
      defaultData: modelValue,
    });
    const { applyLogic } = useJsonLogic(dataResource);

    const defaultFieldAttrs = inject('defaultFieldAttrs', {});
    const mergedAttrs = reactive({
      ...defaultFieldAttrs,
      ...props.schema.attrs,
    });
    const attrs = reactive({});
    watch(
      () => dataResource,
      () => {
        // 每次表单数据更新，均重新计算逻辑属性
        Object.keys(mergedAttrs).forEach((key) => {
          attrs[key] = applyLogic(mergedAttrs[key]);
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    const onUpdate = (val) => {
      emit('update:modelValue', val);
    };

    if (props.modelValue === undefined) {
      emit('update:modelValue', props.schema.defaultValue === undefined ? null : props.schema.defaultValue);
    }

    return {
      getComponent,
      getRule,
      onUpdate,
      attrs,
    };
  },
});
</script>

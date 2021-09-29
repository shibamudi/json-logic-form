<template>
  <q-form
      class="q-col-gutter-y-md"
      @submit.prevent="onSubmit"
      @reset="onReset"
  >
    <div>
      <div v-if="!!title" class="text-subtitle1">{{ title }}</div>
      <div v-if="!!comment" class="text-caption">{{ comment }}</div>
    </div>
    <template v-for="(item, index) in schema" :key="index">
      <component
          :is="getContainer(item.type)"
          v-if="!applyLogic(item.hide)"
          :schema="item"
          :model-value="formData[item.name]"
          @update:model-value="onUpdate($event, item.name)"
      />
    </template>
    <div>
      <slot name="action">
        <slot name="actionPrepend" />
        <q-btn v-if="showSubmit" :label="submitText" type="submit" color="primary"/>
        <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
        <slot name="actionAppend" />
      </slot>
    </div>
  </q-form>
</template>

<script>
import {
  defineComponent, provide, reactive, readonly, watch,
} from 'vue';
import { useQuasar, QForm, QBtn } from 'quasar';
import useJsonLogic from '../composables/use-json-logic';
import useContainer from '../composables/use-container';
import useDataResource from '../composables/use-data-resource';
import useGraphBuilder from '../composables/use-graph-builder';

export default defineComponent({
  name: 'JsonLogicForm',
  components: { QForm, QBtn },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: null,
    },
    comment: {
      type: String,
      default: null,
    },
    schema: {
      type: Array,
      default: () => ([]),
    },
    injectKeys: {
      type: Array,
      default: () => ([]),
    },
    gqlSchema: {
      type: Object,
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '提交',
    },
    submitConfirm: {
      type: Boolean,
      default: true,
    },
    submitConfirmText: {
      type: String,
      default: '确认提交表单？',
    },
    showReset: {
      type: Boolean,
      default: true,
    },
    resetText: {
      type: String,
      default: '重置',
    },
    resetConfirm: {
      type: Boolean,
      default: true,
    },
    resetConfirmText: {
      type: String,
      default: '确认清空表单？',
    },
    defaultFieldAttrs: {
      type: Object,
      default: () => ({}),
    },
    customComponents: {
      type: Object,
      default: () => ({}),
    },
    customRules: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [
    'update:modelValue',
    'submit',
    'reset',
  ],
  setup(props, { emit }) {
    provide('defaultFieldAttrs', {
      filled: true,
      'hide-bottom-space': true,
      'lazy-rules': true,
      debounce: 100,
      ...props.defaultFieldAttrs,
    });
    provide('customComponents', props.customComponents);
    provide('customRules', props.customRules);

    const { getContainer } = useContainer();

    const formData = reactive({});
    provide('formData', readonly(formData));

    const dataResource = useDataResource({
      formData,
      defaultData: formData,
    }, props.injectKeys);
    const { applyLogic } = useJsonLogic(dataResource);
    const { build } = useGraphBuilder(dataResource);

    watch(
      () => props.modelValue,
      (val) => {
        Object.keys({ ...val }).forEach((key) => {
          formData[key] = val[key];
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    function onUpdate(val, key) {
      formData[key] = val;

      // 表单值更新之后，检查隐藏逻辑规则，如果隐藏则删除对应值
      props.schema.forEach((item) => {
        if (applyLogic(item.hide)) {
          delete formData[item.name];
        }
      });

      emit('update:modelValue', readonly(formData));
    }

    const $q = useQuasar();

    function submit() {
      if (props.gqlSchema) {
        const gql = build(props.gqlSchema);
        emit('submit', readonly(formData), gql);
      } else {
        emit('submit', readonly(formData));
      }
    }

    function onSubmit() {
      if (props.submitConfirm) {
        $q.dialog({
          message: props.submitConfirmText,
        }).onOk(() => {
          submit();
        });
      } else {
        submit();
      }
    }

    function reset() {
      Object.keys(formData).forEach((key) => {
        delete formData[key];
      });
      emit('reset');
    }

    function onReset() {
      if (props.resetConfirm) {
        $q.dialog({
          message: props.resetConfirmText,
        }).onOk(() => {
          reset();
        });
      } else {
        reset();
      }
    }

    return {
      getContainer,
      formData,
      applyLogic,
      onUpdate,
      onSubmit,
      onReset,
    };
  },
});
</script>

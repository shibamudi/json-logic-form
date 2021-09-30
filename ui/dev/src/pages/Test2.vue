<template>
  <q-page padding>
    <json-logic-form
      title="aa"
      comment="bb"
      :schema="schema"
      :form-validate="formValidate"
      v-model="formData"
      @submit="onSubmit"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Test2',
  setup() {
    const schema = [
      {
        component: 'input',
        name: 'q1',
        rules: ['required'],
      },
      {
        component: 'input',
        name: 'q2',
        rules: ['required'],
      },
    ];

    const formData = ref({});

    const formValidate = {
      logic: {
        or: [
          {
            '===': [
              { var: 'formData.q1' },
              { var: 'formData.q2' },
            ],
          },
          'Q1 与 Q2 应相同！',
        ],
      },
      dataResource: 'root',
    };

    function onSubmit(data) {
      console.log(data);
    }

    return {
      schema,
      formValidate,
      formData,
      onSubmit,
    };
  },
});
</script>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>

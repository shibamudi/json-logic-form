<template>
  <q-page padding>
    <json-logic-form
      title="aa"
      comment="bb"
      :schema="schema"
      :gql-schema="gqlSchema"
      v-model="formData"
      @submit="onSubmit"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, provide } from 'vue';

export default defineComponent({
  name: 'Test1',
  setup() {
    const schema = [
      {
        component: 'input',
        name: 'q1',
        rules: ['required'],
      },
      {
        type: 'array',
        name: 'q2',
        min: 2,
        title: 'dfds',
        children: [
          {
            component: 'input',
            name: 'q2_1',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q2_2',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q2_3',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q2_4',
            rules: ['required'],
          },
        ],
      },
      {
        type: 'group',
        name: 'q3',
        children: [
          {
            component: 'input',
            name: 'q3_1',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q3_2',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q3_3',
            rules: ['required'],
          },
          {
            component: 'input',
            name: 'q3_4',
            rules: ['required'],
          },
        ],
      },
    ];

    const gqlSchema = {
      mutation: {
        insert_a: {
          __args: {
            q1: {
              logic: { var: 'q1' },
            },
          },
          id: true,
        },
      },
    };

    provide('a', ref(1));

    const formData = ref({});

    function onSubmit(data, gql) {
      console.log(data);
      console.log(gql);
    }

    return {
      schema,
      gqlSchema,
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

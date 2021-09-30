# Quasar App Extension json-logic-form

Quasar app extension provides a form builder that uses a JSON schema containing logic. Use form data, injection data and logical description in JSON schema to control form structure, field properties, and even produce graphql mutation for submission. This can be useful when you want to define a flexible form from data in a database.

> The document is not finished yet.

[![npm](https://img.shields.io/npm/v/quasar-app-extension-json-logic-form.svg?label=quasar-app-extension-json-logic-form)](https://www.npmjs.com/package/quasar-app-extension-json-logic-form)
[![npm](https://img.shields.io/npm/dt/quasar-app-extension-json-logic-form.svg)](https://www.npmjs.com/package/quasar-app-extension-json-logic-form)

# Install
```bash
quasar ext add json-logic-form
```
Quasar CLI will retrieve it from NPM and install the extension.

# Uninstall
```bash
quasar ext remove json-logic-form
```

# Basic Use
Once installed, it can be used directly in any position.
```html
...
<json-logic-form :schema="schema"/>
...
```
However, it is more recommended to make a layer of packaging to facilitate the use of custom form components and custom validation rules.
```html
<template>
  <json-logic-form
    v-bind="$attrs"
    :custom-components="customComponents"
    :custom-rules="customRules"
    :default-field-attrs="defaultFieldAttrs"
  >
    <template #action>
      <slot name="action" />
    </template>
    <template #actionPrepend>
      <slot name="actionPrepend" />
    </template>
    <template #actionAppend>
      <slot name="actionAppend" />
    </template>
  </json-logic-form>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'MyJsonLogicForm',
    inheritAttrs: false,
    setup() {
      return {
        customComponents: {...},
        customRules: {...},
        defaultFieldAttrs: {...},
      };
    },
  });
</script>
```

# API
## Props
### modelValue
```
modelValue: {
  type: Object,
  default: () => ({}),
}
```
Model of form data. Usually use `v-model` directive instead.

### title
```
title: {
  type: String,
  default: null,
}
```
Form title.

### comment
```
comment: {
  type: String,
  default: null,
}
```
Some comment text blow the form title.

### Buttons
```
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
}
```
Control the behavior of form buttons.

### schema
```
schema: {
  type: Array,
  default: () => ([]),
}
```
The most important thing: **Form Schema**. It's an array of **Field Schema**. It determines the structure of the form and form data at the same time.

### injectKeys
```
injectKeys: {
  type: Array,
  default: () => ([]),
}
```
An array of string. Each item is a key of vue3 inject variable. This is a way to influence form logic through data outside the form. See the **Logic** section for details.

### gqlSchema
```
gqlSchema: {
  type: Object,
}
```
See the **GraphQL Schema** section for details.

### defaultFieldAttrs
```
defaultFieldAttrs: {
  type: Object,
  default: () => ({}),
}
```
See the **Field Attrs** section for details.

### customComponents
```
customComponents: {
  type: Object,
  default: () => ({}),
}
```
See the **Custom Component** section for details.

### customRules
```
customRules: {
  type: Object,
  default: () => ({}),
}
```
See the **Validate** section for details.

### formValidate
```
formValidate: {
  type: Object,
}
```
Additional global validation.

## Events
### update:modelValue -> function(formData)
Update event of form data. Usually use `v-model` directive instead.

### submit -> function(formData, [gql])
Submit event. If prop `sqlSchema` is set, the function has a second parameter of GraphQL mutation string.

### reset -> function()
Reset event. Go for little.

## Slots
### action
Replace form button section.

### actionPrepend
Prepend form button section.

### actionAppend
Append form button section.

# Logic


# Field Schema
## type: group | array | field
Optional, default: `field`.
## component

# Custom Component


# Field Attrs


# Validate
```javascript
const rules = {
    required: (options) => (val) => !!val || options.message || '该项为必填项！',
    minValue: (options) => (val) => val >= options.value || options.message || `数值应不小于${options.value}！`,
    maxValue: (options) => (val) => val <= options.value || options.message || `数值应不大于${options.value}！`,
    minLength: (options) => (val) => (!!val && val.length >= options.value) || options.message || `内容应不少于${options.value}字符!`,
    maxLength: (options) => (val) => (!!val && val.length <= options.value) || options.message || `内容应不多于${options.value}字符!`,
    ...customRules, 
};
```

# GraphQL Schema

# Donate
If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).

# License
MIT (c) 十八亩地 <919177684@qq.com>

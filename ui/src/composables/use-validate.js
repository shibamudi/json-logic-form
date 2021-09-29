function useValidate(customRules = {}) {
  const rules = {
    required: (options) => (val) => !!val || options.message || '该项为必填项！',
    minValue: (options) => (val) => val >= options.value || options.message || `数值应不小于${options.value}！`,
    maxValue: (options) => (val) => val <= options.value || options.message || `数值应不大于${options.value}！`,
    minLength: (options) => (val) => (!!val && val.length >= options.value) || options.message || `内容应不少于${options.value}字符!`,
    maxLength: (options) => (val) => (!!val && val.length <= options.value) || options.message || `内容应不多于${options.value}字符!`,
    ...customRules,
  };

  function getRule(options = null) {
    let key;
    if (typeof options === 'string') {
      key = options;
    } else {
      key = options.key;
    }
    return rules[key] ? rules[key](options) : undefined;
  }

  return {
    getRule,
  };
}

export default useValidate;

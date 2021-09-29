import jsonLogic from 'json-logic-js';

function isLogic(schema) {
  return typeof schema === 'object'
    && schema !== null
    && !Array.isArray(schema)
    && jsonLogic.is_logic(schema.logic);
}

function useJsonLogic(dataResource = {}) {
  function applyLogic(schema) {
    // 非逻辑值，直接返回原始值
    if (!isLogic(schema)) {
      return schema;
    }

    const data = schema.dataResource
      ? dataResource[schema.dataResource]
      : dataResource.defaultData
        ? dataResource.defaultData
        : dataResource;

    return jsonLogic.apply(schema.logic, data);
  }

  function applyLogicDeep(schema) {
    // 当前即为logic对象，直接执行逻辑，并对返回值继续遍历执行
    if (isLogic(schema)) {
      return applyLogicDeep(applyLogic(schema));
    }
    // 当前为数组，对每个元素遍历执行
    if (Array.isArray(schema)) {
      return schema.map((e) => applyLogicDeep(e));
    }
    // 当前为普通对象，对每个元素值遍历执行
    if (typeof schema === 'object' && schema !== null) {
      const newData = {};
      Object.keys(schema).forEach((key) => {
        newData[key] = applyLogicDeep(schema[key]);
      });
      return newData;
    }
    // 当前已不可能为logic对象，也不可能存在子元素为逻辑对象，直接返回该值，终止遍历
    return schema;
  }

  return {
    isLogic,
    applyLogic,
    applyLogicDeep,
  };
}

export default useJsonLogic;

export {
  isLogic,
};

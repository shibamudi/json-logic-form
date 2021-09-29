import JsonLogicFormContainerArray from '../components/JsonLogicFormContainerArray';
import JsonLogicFormContainerGroup from '../components/JsonLogicFormContainerGroup';
import JsonLogicFormContainerField from '../components/JsonLogicFormContainerField';

function useContainer() {
  const containers = {
    array: JsonLogicFormContainerArray,
    group: JsonLogicFormContainerGroup,
    field: JsonLogicFormContainerField,
  };

  const getContainer = (key) => {
    if (Object.prototype.hasOwnProperty.call(containers, key)) {
      return containers[key];
    }
    return containers.field;
  };

  return {
    getContainer,
  };
}

export default useContainer;

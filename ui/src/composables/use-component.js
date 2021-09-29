import {
  QInput,
  QSelect,
  QRadio,
  QCheckbox,
  QToggle,
  QBtnToggle,
  QOptionGroup,
  QSlider,
  QRange,
  QTime,
  QDate,
} from 'quasar';

function useComponent(customComponents = {}) {
  const components = {
    input: QInput,
    select: QSelect,
    radio: QRadio,
    checkbox: QCheckbox,
    toggle: QToggle,
    btnToggle: QBtnToggle,
    optionGroup: QOptionGroup,
    slider: QSlider,
    range: QRange,
    time: QTime,
    date: QDate,
    ...customComponents,
  };

  const getComponent = (key) => {
    if (Object.prototype.hasOwnProperty.call(components, key)) {
      return components[key];
    }
    return components.input;
  };

  return {
    getComponent,
  };
}

export default useComponent;

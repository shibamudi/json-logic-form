import { inject, readonly } from 'vue';

function useDataResource(data, injectKeys = []) {
  const injectData = {};
  injectKeys.forEach((key) => {
    injectData[key] = inject(key, null);
  });

  return readonly({
    formData: inject('formData', null),
    groupData: inject('groupData', null),
    arrayData: inject('arrayData', null),
    arrayItemData: inject('arrayItemData', null),
    ...data,
    injectData,
  });
}

export default useDataResource;

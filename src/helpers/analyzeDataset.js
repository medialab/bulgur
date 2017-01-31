
const analyzeCollection = (collection) => {
  // list unique objects properties
  const properties = collection.reduce((list, item) => {
    return Object.keys(item).reduce((localList, propName) => {
      return localList.indexOf(propName) === -1 ? localList.concat(propName) : localList;
    }, list);
  }, []);
  const propertiesMap = properties.map(propertyName => {
    let covered = 0;
    const objectsTypes = collection.map(obj => {
      const val = obj[propertyName];
      if (val !== undefined && val !== '') {
        covered = covered + 1;
      }
      if (Number.isNaN(+val) === false) {
        return 'number';
      }
 else if (typeof val !== 'object') {
        return 'string';
      }
    });
    const propertiesTypes = objectsTypes.filter(type => type !== undefined)
    .reduce((types, objectType) => {
      return {
        ...types,
        [objectType]: types[objectType] === undefined ? 1 : types[objectType] + 1
      };
    }, {});

    const coverage = {
      covered,
      total: collection.length,
      coverage: covered / collection.length
    };

    return {
      propertyName,
      propertiesTypes,
      coverage
    };
  });
  // return the collection map
  return propertiesMap;
};

export default function analyzeDataset(dataset) {
  return Object.keys(dataset)
  .reduce((finalFields, collectionId) => ({
    ...finalFields,
    [collectionId]: analyzeCollection(dataset[collectionId]).map(field => ({
      ...field,
      collectionId
    }))
  }), {});
}

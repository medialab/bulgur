/**
 * This module provides heuristics to analyse how the different dimensions of a dataset are populated
 * @module bulgur/utils/analyzeDataset
 */


/**
 * Analyzes a collection
 * @param {array} collection - the collection to analyse
  * @return {array} propertyMap - a list of all dimensions of the collections, documented w/ their coverage and properties types
 */
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


/**
 * Analyses, for each collection of a dataset, and for each dimension/property, coverage (number of undefined values) and value types
 * @param {object} dataset - the dataset to analyse
 * @return {object} propertyMaps - the propertyMaps of the collections of the given dataset
 */
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

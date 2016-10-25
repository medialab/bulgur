import projectModel from '../models/bulgurProjectModel';

const testType = (entity, type) => {
  switch (type) {
    case 'array':
      return Array.isArray(entity);
    default:
      return typeof entity === type;
  }
};

const validateEntity = (entity, model) => {
  const type = model.type;
  const validType = testType(entity, type);
  if (validType) {
    if (model.contains) {
      let hasInvalid = false;
      Object.keys(model.contains).some(key => {
        const subModel = model.contains[key];
        const valid = validateEntity(entity[key], subModel);
        if (valid === false) {
          hasInvalid = true;
          return true;
        }
      });
      return !hasInvalid;
    }
    // valid type and no contains
    return true;
  }
  else {
    return false;
  }
};

export default function validateProject(jsonContent) {
  return validateEntity(jsonContent, projectModel);
}

const req = require.context('../../example_datasets/');

export function loadExampleFile(fileName) {
  return req('./' + fileName);
}

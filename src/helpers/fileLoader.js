const req = require.context ? require.context('../../example_datasets/') : function() {};

export function loadExampleFile(fileName) {
  return req('./' + fileName);
}

export function validateFileExtension (fileName = '', visualizationModel) {
  const fileExtension = fileName.split('.').pop();
  return visualizationModel.acceptedFileExtensions.find(ext => ext === fileExtension) !== undefined;
}

export function getFileAsText(fileToRead, callback) {
  let reader = new FileReader();
  // Handle errors load
  reader.onload = (event) => {
    callback(null, event.target.result);
    reader = undefined;
  };
  reader.onerror = (event) => {
    callback(event.target.error);
    reader = undefined;
  };
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
}

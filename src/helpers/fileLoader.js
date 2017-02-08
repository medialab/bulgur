/**
 * This module helps to load files from app server or user own file system
 * @module bulgur/utils/fileLoader
 */

let req;
// as require.context does not work in test environment, this is a little hack
// to prevent its use
// (note: but loadExampleFile, which depends on require.context, is still not testable then)
if (global.window !== undefined) {
  req = require.context('../../example_datasets/');
}
/**
 * Loads a file from the app example files
 * @param {string} fileName - the name of the file to load
 * @return {string} rawContent - the raw string content of the file loaded
 */
export function loadExampleFile(fileName) {
  const data = req('./' + fileName);
  if (typeof data === 'object') {
    return JSON.stringify(data);
  }
  return data;
}
/**
 * Validates whether the extension of a file is valid against its visualization model
 * @param {string} fileName - the name of the file to validate
 * @param {object} visualizationModel - the model of the visualization to validate the filename against
 * @return {boolean} isValid - whether the filename is valid
 */
export function validateFileExtension (fileName = '', visualizationModel) {
  const fileExtension = fileName.split('.').pop();
  return visualizationModel.acceptedFileExtensions.find(ext => ext === fileExtension) !== undefined;
}
/**
 * Reads the raw string content of a file from user file system
 * @param {File} fileToRead - the file to read
 * @param {function} callback
 */
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
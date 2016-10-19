import {
  csvParse,
  tsvParse
} from 'd3-dsv';

let req;
// as require.context does not work in test environment, this is a little hack
// to prevent its use
// (note: but loadExampleFile, which depends on require.context, is still not testable then)
if (global.window !== undefined) {
  req = require.context('../../example_datasets/');
}

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

export function convertRawStrToJson(str = '', format) {
  switch (format) {
    case 'json':
      return JSON.parse(str);
    case 'csv':
      return csvParse(str);
    case 'tsv':
      return tsvParse(str);
    case 'gexf':
      return [{
        gexf: str
      }];
    default:
      return str;
  }
}

export function setDataFields(data) {
  const fields = Object.keys(data[0]);
  return fields.map(name => {
    // to improve
    let numberNumbers = 0;
    let numberUrls = 0;
    data.forEach(point => {
      if (point[name] === undefined) {
        return;
      }
      if (!isNaN(+point[name])) {
        numberNumbers++;
      }
      else if (point[name].trim().length === 0 || point[name].indexOf('http') === 0 ||
        point[name].indexOf('www') === 0) {
        numberUrls++;
      }
    });
    let type;
    if (numberNumbers === data.length) {
      type = 'number';
    }
    else if (numberUrls === data.length) {
      type = 'url';
    }
    else type = 'string';
    return {
      name,
      type
    };
  });
}

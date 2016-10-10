import {expect} from 'chai';

import {
  validateFileExtension
} from './fileLoader';

describe('fileLoader helpers', () => {
  describe('validateFileExtension', () => {
    const visualizationModel = {
      acceptedFileExtensions: ['csv', 'tsv', 'dsv']
    };
    const validFileNames = ['myfile.csv', 'myfile.tsv', 'myfile.dsv', 'myfile.doc.csv'];
    const invalidFileNames = ['', 'myfile', 'myfile_csv', 'myfile.csv.psd'];

    it('should accept valid extensions', (done) => {
      validFileNames.forEach(fileName => {
        const valid = validateFileExtension(fileName, visualizationModel);
        return expect(valid).to.be.true;
      });
      done();
    });

    it('should not accept invalid extensions', (done) => {
      invalidFileNames.forEach(fileName => {
        const valid = validateFileExtension(fileName, visualizationModel);
        return expect(valid).to.be.false;
      });
      done();
    });
  });
});

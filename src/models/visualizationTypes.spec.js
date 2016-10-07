import {expect} from 'chai';
import {exists} from 'fs';
import {resolve} from 'path';

import models from './visualizationTypes';

describe('visualization types models', () => {
  Object.keys(models).forEach((modelName) => {
    describe(modelName + 'visualization model', () => {
      const model = models[modelName];
      it('should present valid model keys', (done) => {
        expect(model).to.have.property('acceptedFileExtensions');
        expect(model).to.have.property('invariantParameters');
        expect(model).to.have.property('samples');
        done();
      });

      it('should have valid examples files', (done) => {
        model.samples.forEach(sample => {
          exists(resolve(__dirname + '/../../example_datasets/' + sample.fileName), (ok) => {
            expect(ok).to.equal(true);
            done();
          });
        });
      });
    });
  });
});

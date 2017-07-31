/**
 * This module provides unit tests for the presentationValidator helper
 * @module bulgur/utils/presentationValidator
 */

const validPresentations = [
    require('../../mocks/simple-map-presentation.json')
];
const invalidPresentations = [
  Object.assign({}, validPresentations[0],
    {order: undefined})
];

import {expect} from 'chai';

import validate from './presentationValidator';

describe('presentationValidator', () => {
  it('should successfully parse valid presentations', done => {
    validPresentations.forEach(presentation => {
      const validated = validate(presentation);
      return expect(validated).to.be.true;
    });
    done();
  });

  it('should successfully parse presentations with missing titles', done => {

    done();
  });

  it('should refuse presentations with missing fields', done => {
    invalidPresentations.forEach(presentation => {
      const validated = validate(presentation);
      return expect(validated).to.be.false;
    });
    done();
  });

  // todo
  // it('should refuse presentations with non-matching uuids', done => {
  //   done();
  // });


  // it('', done => {
  //  done();
  // });
});


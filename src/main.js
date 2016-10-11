/**
 * Quinoa Manylines Application Endpoint
 * ======================================
 *
 * Rendering the application.
 */
import React from 'react';
import {render} from 'react-dom';
import Quinoa from 'quinoa';
import {Provider} from 'react-redux';
import uuid from 'uuid';
import {EditorState} from 'draft-js';

import configureStore from './redux/configureStore';
import Application from './Application';

let CurrentApplication = Application;

const store = configureStore();
window.store = store;


// Init quinoa
function createSlide(data) {
  return {
    id: uuid.v4(),
    title: data.title || '',
    markdown: data.markdown || '',
    draft: EditorState.createEmpty(),
    meta: {
      graph: 'arctic',
      camera: {
        x: 0,
        y: 0,
        angle: 0,
        ratio: 1
      }
    }
  };
}

/**
 * Create an editor state object from slides & resources.
 *
 * @param  {array}  slides - Slides list.
 * @return {object}        - Editor state object.
 */
function createEditorState(slides = []) {
  const slidesMap = {};

  slides.forEach(slide => (slidesMap[slide.id] = slide));

  return {
    current: slides[0].id,
    slides: slidesMap,
    order: slides.map(slide => slide.id)
  };
}

/**
 * Create a full state from slides & resources.
 *
 * @param  {array}  slides - Slides list.
 * @return {object}        - Quinoa state object.
 */
function createQuinoaState(slides = []) {
  return {
    editor: createEditorState(slides)
  };
}

const QUINOA_DEFAULT_STATE = createQuinoaState([
  createSlide({title: 'First slide'}),
  createSlide({title: 'Second slide'})
]);

const quinoa = new Quinoa({
  defaultState: QUINOA_DEFAULT_STATE,
  slideCreator: createSlide
});
window.quinoa = quinoa;

const mountNode = document.getElementById('mount');

function renderApplication() {
  const group = (
    <Provider store={store}>
      <CurrentApplication />
    </Provider>
  );

  render(group, mountNode);
}

renderApplication();

// quinoa.subscribe(renderApplication);

/**
 * Hot-reloading.
 */

module.hot.accept('./Application', function() {
  CurrentApplication = require('./Application').default;
  renderApplication();
});

// quinoa.hot(renderApplication);


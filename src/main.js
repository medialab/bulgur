/**
 * Quinoa Manylines Application Endpoint
 * ======================================
 *
 * Rendering the application.
 */
import uuid from 'uuid';
import React from 'react';
import {render} from 'react-dom';
import Quinoa from 'quinoa';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import reducers from './reducers';
import Application from './containers/Application';



import './style/bulgur.scss';

// import {createState} from '../../../src/state';

// TODO: this should move away to be encapsulated in quinoa
// import {EditorState} from 'draft-js';

let CurrentApplication = Application;

const store = createStore(reducers);
window.store = store;

/**
 * Style.
 */
 /*
import 'normalize.css';
import 'codemirror/lib/codemirror.css';
import '../style/codemirror-theme.css';
import '../../../src/quinoa.css';
import '../style/manylines.scss';
*/
/**
 * Creating our editor.
 */
 /*
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

const DEFAULT_STATE = createState([
  createSlide({title: 'First slide'}),
  createSlide({title: 'Second slide'})
]);

const quinoa = new Quinoa({
  defaultState: DEFAULT_STATE,
  slideCreator: createSlide
});
window.quinoa = quinoa;

/**
 * Rendering logic.
 */
 
const mountNode = document.getElementById('mount');

// NOTE: it's probably better to plug the state somewhere else for perf reasons
function mapStore() {
  const {editor} = quinoa.getState();

  const currentSlide = editor.slides[editor.current];

  return {
    currentSlide: editor.current,
    currentGraph: currentSlide.meta.graph,
    camera: currentSlide.meta.camera
  };
}

function renderApplication() {
  const group = (
    <Provider store={store}>
      <CurrentApplication
        // quinoa={{actions: quinoa.getActions(), store: mapStore()}}
        // editorComponent={quinoa.getEditorComponent()}
        // draftComponent={quinoa.getDraftComponentForSlide()} 
      />
    </Provider>
  );

  render(group, mountNode);
}

renderApplication();

// quinoa.subscribe(renderApplication);

/**
 * Hot-reloading.
 */

module.hot.accept('./containers/Application', function() {
  CurrentApplication = require('./containers/Application').default;
  renderApplication();
});

// quinoa.hot(renderApplication);


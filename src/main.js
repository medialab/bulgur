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

import reducers from './rootReducer';
import Application from './Application';

let CurrentApplication = Application;

const store = createStore(
  reducers, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
window.store = store;

const mountNode = document.getElementById('mount');

function renderApplication() {
  const group = (
    <Provider store={store}>
      <CurrentApplication/>
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


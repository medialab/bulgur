/**
 * Bulgur Application Endpoint
 * ======================================
 *
 * Rendering the application.
 */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from './redux/configureStore';
import Application from './Application';
import {plugQuinoa} from './helpers/configQuinoa';

let CurrentApplication = Application;

const initialState = {};

const store = configureStore(initialState);
window.store = store;

const mountNode = document.getElementById('mount');

export function renderApplication() {
  const group = (
    <Provider store={store}>
      <CurrentApplication />
    </Provider>
  );
  render(group, mountNode);
}

plugQuinoa(renderApplication);
renderApplication();

/**
 * Hot-reloading.
 */
if (module.hot) {
  module.hot.accept('./Application', function() {
    CurrentApplication = require('./Application').default;
    renderApplication();
  });
}

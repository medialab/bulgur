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
import { initQuinoa } from './helpers/configQuinoa';

let CurrentApplication = Application;

const store = configureStore();
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

initQuinoa(renderApplication);
renderApplication();

/**
 * Hot-reloading.
 */

module.hot.accept('./Application', function() {
  CurrentApplication = require('./Application').default;
  renderApplication();
});

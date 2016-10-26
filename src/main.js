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
import validateProject from './helpers/validateProject';

let CurrentApplication = Application;

let initialState = {};

// case all-in-one readonly app
if (window.__project__) {
  const project = window.__project__;
  if (validateProject(project)) {
    initialState = {
      activeStory: {
        globalUi: {
          newStoryModalOpen: false,
          takeAwayModalOpen: false,
          viewEqualsSlideParameters: false
        },
        visualization: {
          data: project.data,
          visualizationType: project.globalParameters.visualizationType,
          parameters: project.globalParameters.parameters,
          readOnly: true
        }
      }
    };
  }
}


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

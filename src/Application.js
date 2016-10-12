/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';

import './Application.scss';

import Bulgur from './features/Bulgur/components/BulgurContainer.js';

import {
  default as quinoa,
  actions as quinoaActions,
  mapStore
} from './helpers/configQuinoa';

const Application = ({}) => (
  <Bulgur
    quinoaState={mapStore(quinoa)}
    quinoaActions={quinoaActions}
    id="wrapper"
    className="bulgur" />
);

export default Application;

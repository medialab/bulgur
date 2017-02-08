/**
 * This module exports the models to use in the whole bulgur application (visualizations types defintions, ...)
 * @module bulgur/models
 */
import * as visTypes from './visualizationTypes';
import presentationModelF from './presentationModel';

export const visualizationTypes = visTypes.default;
export const presentationModel = presentationModelF;
/**
 * This module previsualizew a visualization and transmits nodes positions when used for previewing a network.
 * It is connected to the redux logic to handle vis-to-data changes in network case
 * @module bulgur/features/ConfigurationDialog
 */

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import HelpPin from '../../../components/HelpPin/HelpPin';

import * as duck from '../duck';

@connect(
  state => ({
    ...duck.selector(state.presentationCandidate)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck
    }, dispatch)
  })
)
export default class VisualizationPreviewContainer extends Component {

  constructor(props) {
    super(props);
    this.saveNodesPositions = this.saveNodesPositions.bind(this);
  }

  saveNodesPositions() {
    if (this.visualization && this.visualization.getNodesPositions) {
      const nodes = this.visualization.getNodesPositions();
      this.props.actions.setVisualizationNodesPosition(this.props.visualizationKey, nodes);
    }
  }

  render() {
    const {
      visualization,
      visualizationTypesModels,
      visualizationKey,
      hasSlides
    } = this.props;
    const setIsSpatializing = () => this.props.actions.setVisualizationIsSpatializing(visualizationKey);
    const isSpatializing = visualization.isSpatializing;

    const baseViewParameters = visualization.viewParameters || visualizationTypesModels[visualization.metadata.visualizationType].defaultViewParameters;
    const viewParameters = {
      ...baseViewParameters,
      colorsMap: visualization.colorsMap
    };
    // flatten datamap fields (todo: refactor as helper)
    const dataMap = Object.keys(visualization.dataMap).reduce((result, collectionId) => ({
      ...result,
      [collectionId]: Object.keys(visualization.dataMap[collectionId]).reduce((propsMap, parameterId) => {
        const parameter = visualization.dataMap[collectionId][parameterId];
        if (parameter.mappedField) {
          return {
            ...propsMap,
            [parameterId]: parameter.mappedField
          };
        }
        return propsMap;
      }, {})
    }), {});
    const onChange = e => this.props.actions.setPreviewViewParameters(visualizationKey, e.viewParameters);

    const bindVisualizationRef = (vis) => {
      this.visualization = vis;
    };
    return (
      <section className="preview">
        <VisualizationManager
          visualizationType={visualization.metadata.visualizationType}
          data={visualization.data}
          dataMap={dataMap}
          viewParameters={viewParameters}
          isSpatializing={isSpatializing}
          ref={bindVisualizationRef}
          onUserChange={onChange} />
        {
          visualization.metadata.visualizationType === 'network' &&
          !hasSlides
          ?
            <div className="spatialization-controls">
              <button id="spatialize-nodes" className={isSpatializing ? 'active' : ''} onClick={setIsSpatializing}>
                {isSpatializing ? 'Stop spatialization'
              : <span>
                  Run spatialization <HelpPin position="left">
              The network will be spatialized with ForceAtlas2 algorithm
            </HelpPin>
              </span>}
              </button>
              <button id="save-nodes" onClick={this.saveNodesPositions}>
              Save nodes positions<HelpPin position="left">
              Current positions will be saved in visualization's data and used for the presentation
            </HelpPin>
              </button>
            </div>
          : null
        }
      </section>
    );
  }
}

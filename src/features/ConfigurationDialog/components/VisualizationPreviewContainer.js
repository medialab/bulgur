/**
 * This module previsualizes a visualization and transmits nodes positions when used for previewing a network.
 * It is connected to the redux logic to handle vis-to-data changes in network case (sending to the logic new nodes positions)
 * @module bulgur/features/ConfigurationDialog
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import HelpPin from '../../../components/HelpPin/HelpPin';

import {translateNameSpacer} from '../../../helpers/translateUtils';

import * as duck from '../duck';


/**
 * Redux-decorated component class rendering the visualization preview component in the app
 */
@connect(
  state => ({
    ...duck.selector(state.presentationCandidate),
    lang: state.i18nState.lang
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck
    }, dispatch)
  })
)
export default class VisualizationPreviewContainer extends Component {


  /**
   * Context data used by the component
   */
  static contextTypes = {
    t: PropTypes.func.isRequired
  }


  /**
   * constructor
   * @param {object} props - properties provided to component at instanciation
   */
  constructor(props) {
    super(props);
    this.saveNodesPositions = this.saveNodesPositions.bind(this);
  }


  /**
   * Defines whether the component should re-render
   * @param {object} nextProps - the props to come
   * @param {object} nextState - the state to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate(nextProps) {
    return this.props.visualization.isSpatializing !== nextProps.visualization.isSpatializing
            || this.props.visualization.viewParameters !== nextProps.visualization.viewParameters;
  }


  /**
   * For network visualizations,
   * saves the current position of the network's node.
   * This feature is aimed at enabling the use
   * of not-spatialized network datasets.
   * todo: it could be widely improved, for now it is just
   * a quick fix for recurrent use cases of students having
   * lists of nodes and edges but no spatialization.
   */
  saveNodesPositions() {
    if (this.visualization && this.visualization.getNodesPositions) {
      const nodes = this.visualization.getNodesPositions();
      this.props.actions.setVisualizationNodesPosition(this.props.visualizationKey, nodes);
    }
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const translate = translateNameSpacer(this.context.t, 'Features.ConfigurationDialog');
    const {
      visualization,
      visualizationKey,
      hasSlides
    } = this.props;
    const setIsSpatializing = () => this.props.actions.setVisualizationIsSpatializing(visualizationKey);
    const isSpatializing = visualization.isSpatializing;
    const viewParameters = visualization.viewParameters;
    const onChange = e => this.props.actions.setPreviewViewParameters(visualizationKey, e.viewParameters);
    const bindVisualizationRef = (vis) => {
      this.visualization = vis;
    };
    return (
      <section className="preview">
        <VisualizationManager
          visualizationType={visualization.metadata.visualizationType}
          data={visualization.data}
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
                {isSpatializing ? translate('stop-spatialization')
              : <span>
                {translate('run-spatialization')} <HelpPin position="left">
                  {translate('run-spatialization-help')}
                </HelpPin>
              </span>}
              </button>
              <button id="save-nodes" onClick={this.saveNodesPositions}>
                {translate('save-nodes-positions')}<HelpPin position="left">
                  {translate('save-nodes-positions-help')}
                </HelpPin>
              </button>
            </div>
          : null
        }
      </section>
    );
  }
}

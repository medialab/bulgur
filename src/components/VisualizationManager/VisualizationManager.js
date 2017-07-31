/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable visualization manager, focused on the performance
 * optimizations related to re-mapping the data / re-rendering the vis
 * @module bulgur/components/VisualizationManager
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Timeline,
  Network,
  Map,
  SVGViewer,
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

/**
 * VisualizationManager class for building react component instances
 */
class VisualizationManager extends Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);

    this.getNodesPositions = this.getNodesPositions.bind(this);

    this.state = {
      data: undefined
    };
    // todo: why did I have to do that ?
    setTimeout(() => this.updateData(props));
  }


  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (
    this.props.data !== nextProps.data
    || this.props.viewParameters.flattenedDataMap !== nextProps.viewParameters.flattenedDataMap
    ) {
      this.updateData(nextProps);
    }
  }


  /**
   * Defines whether the component should re-render
   * @param {object} nextProps - the props to come
   * @param {object} nextState - the state to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data
    || this.props.viewParameters !== nextProps.viewParameters
    || this.props.isSpatializing !== nextProps.isSpatializing
    ;
  }


  /**
   * Retrieves current positions of the nodes of a network visualization
   * @return {array} positions - an array of nodes positions in the form {x, y, id}
   */
  getNodesPositions() {
    if (this.visualization && this.visualization.getNodesPositions) {
      return this.visualization.getNodesPositions();
    }
  }


  /**
   * Maps properly the visualization's data with provided datamap
   * @param {object} props - the props to inspect
   */
  updateData(props) {
    let visData;
    const {
      data,
      viewParameters,
      visualizationType
    } = props;
    switch (visualizationType) {
      case 'map':
        visData = mapMapData(data, viewParameters.flattenedDataMap);
        break;
      case 'network':
        visData = mapNetworkData(data, viewParameters.flattenedDataMap);
        break;
      case 'timeline':
        visData = mapTimelineData(data, viewParameters.flattenedDataMap);
        break;
      case 'svg':
        visData = data;
        break;
      default:
        return null;
    }
    this.setState({
      data: visData
    });
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      visualizationType,
      viewParameters,
      isSpatializing = false,
      onUserChange
    } = this.props;
    const {
      data
    } = this.state;

    const bindVisualization = visualization => {
      this.visualization = visualization;
    };
    if (data) {
       switch (visualizationType) {
          case 'map':
            return (<Map
              allowUserViewChange
              data={data}
              onUserViewChange={onUserChange}
              viewParameters={viewParameters} />);
          case 'network':
            return (<Network
              allowUserViewChange
              data={data}
              onUserViewChange={onUserChange}
              forceAtlasActive={isSpatializing}
              ref={bindVisualization}
              viewParameters={viewParameters} />);
          case 'timeline':
            return (<Timeline
              allowUserViewChange
              data={data}
              onUserViewChange={onUserChange}
              viewParameters={viewParameters} />);
          case 'svg':
            return (
              <SVGViewer
                allowUserViewChange
                data={data}
                onUserViewChange={onUserChange}
                viewParameters={viewParameters} />
            );
          default:
            return null;
      }
    }
    return null;
  }
}


/**
 * Component's properties types
 */
VisualizationManager.propTypes = {

  /**
   * datamap to use for displaying the visualization (keys are data's collections)
   */
  dataMap: PropTypes.object,

  /**
   * data to use for displaying the visualization (keys are data's collections)
   */
  data: PropTypes.object,

  /**
   * active view parameters to use for displaying the visualization
   */
  viewParameters: PropTypes.object,

  /**
   * type of the visualization to display
   */
  visualizationType: PropTypes.string,

  /**
   * callbacks when user changes the view
   */
  onUserChange: PropTypes.func,
};

export default VisualizationManager;

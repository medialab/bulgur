/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable visualization manager, focused on the performance
 * optimizations related to re-mapping the data / re-rendering the vis
 * @module bulgur/components/VisualizationManager
 */
import React, {Component, PropTypes} from 'react';

import {
  Timeline,
  Network,
  Map,
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

class VisualizationManager extends Component {

  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);

    this.getNodesPositions = this.getNodesPositions.bind(this);

    this.state = {
      data: undefined
    };
    setTimeout(() => this.updateData(props));
  }
  componentWillReceiveProps(nextProps) {
    if (
    this.props.data !== nextProps.data
    || this.props.dataMap !== nextProps.dataMap
    ) {
      this.updateData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data
    || this.props.viewParameters !== nextProps.viewParameters;
  }

  getNodesPositions() {
    if (this.visualization && this.visualization.getNodesPositions) {
      return this.visualization.getNodesPositions();
    }
  }

  updateData(props) {
    let visData;
    const {
      data,
      dataMap,
      visualizationType
    } = props;


    switch (visualizationType) {
      case 'map':
        visData = mapMapData(data, dataMap);
        break;
      case 'network':
        visData = mapNetworkData(data, dataMap);
        break;
      case 'timeline':
        visData = mapTimelineData(data, dataMap);
        break;
      default:
        return null;
    }
    this.setState({
      data: visData
    });
  }

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
          default:
            return null;
      }
    }
 else {
      return null;
    }
  }
}

VisualizationManager.propTypes = {
  // dataMap: PropTypes.Object // commented to avoid messing with the linter
  // data: PropTypes.Object, // commented to avoid messing with the linter
  // viewParameters: PropTypes.Object, // commented to avoid messing with the linter
  visualizationType: PropTypes.String,
  onUserChange: PropTypes.func
};

export default VisualizationManager;

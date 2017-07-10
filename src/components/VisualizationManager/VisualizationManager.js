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
    || this.props.viewParameters.flattenedDataMap !== nextProps.viewParameters.flattenedDataMap
    ) {
      this.updateData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data !== nextState.data
    || this.props.viewParameters !== nextProps.viewParameters
    || this.props.isSpatializing !== nextProps.isSpatializing
    ;
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
    // console.log('re render vis', viewParameters);
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

VisualizationManager.propTypes = {
  // dataMap: PropTypes.Object // commented to avoid messing with the linter
  // data: PropTypes.Object, // commented to avoid messing with the linter
  // viewParameters: PropTypes.Object, // commented to avoid messing with the linter
  visualizationType: PropTypes.string,
  onUserChange: PropTypes.func
};

export default VisualizationManager;

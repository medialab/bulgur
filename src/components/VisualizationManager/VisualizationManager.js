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

import './VisualizationManager.scss';

class VisualizationManager extends Component {

  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);

    this.state = {
      data: undefined
    };
    setTimeout(() => this.updateData(props));
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)
      || JSON.stringify(this.props.dataMap) !== JSON.stringify(nextProps.dataMap)) {
      this.updateData(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)
            || JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters);
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
      onUserChange
    } = this.props;
    const {
      data
    } = this.state;
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
  // dataMap: PropTypes.Object
  // data: PropTypes.Object,
  // viewParameters: PropTypes.Object,
  visualizationType: PropTypes.String,
  onUserChange: PropTypes.func
};

export default VisualizationManager;

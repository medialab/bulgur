import React, {Component} from 'react';
require('gexf');

import './Graph.scss';

/**
 * Constants.
 */
const SIGMA_SETTINGS = {
  labelThreshold: 7,
  minNodeSize: 2,
  edgeColor: 'default',
  defaultEdgeColor: '#D1D1D1',
  sideMargin: 20
};

/**
 * Sigma instance.
 */
const sigInst = new sigma({
  settings: SIGMA_SETTINGS
});

const camera = sigInst.addCamera('main');

// function monkeyPatchCamera(action) {
//   const originalFn = camera.goTo;
//   camera.goTo = function() {
//     if (typeof action === 'function')
//       action();
//     return originalFn.apply(camera, arguments);
//   };

//   return () => {
//     camera.goTo = originalFn;
//   };
// }

class Graph extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {

    // hack - todo : clean
    const data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
    // Adding the relevant renderer
    this.renderer = sigInst.addRenderer({
      container: this.container,
      camera
    });

    // Loading the graph
    sigma.parsers.gexf(
      data,
      sigInst,
      () => sigInst.refresh()
    );

    // Hooking into the camera
    // this.releaseCamera = monkeyPatchCamera(this.updateSlide);

    camera.bind('coordinatesUpdated', () => {
          const coords = {
            cameraX: camera.x,
            cameraY: camera.y,
            cameraRatio: camera.ratio,
            cameraAngle: camera.angle,
          };
          if (JSON.stringify(coords) !== JSON.stringify(this.props.viewParameters)) {
            this.props.updateView(coords);
          }
        });
  }

  componentWillUpdate (next) {
    if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(next.viewParameters)) {
      const coords = {
        x: next.viewParameters.cameraX,
        y: next.viewParameters.cameraY,
        angle: next.viewParameters.cameraAngle,
        ratio: next.viewParameters.cameraRatio,
      };
      camera.goTo(coords);
      sigInst.refresh();
    }
  }

  componentDidUpdate(prev) {
    // If the graph has changed, we reset sigma
    if (prev.data !== this.props.data) {
      const data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
      sigInst.graph.clear();
      sigma.parsers.gexf(
        data,
        sigInst,
        () => {
          // camera.goTo({x: 0, y: 0, angle: 0, ratio: 1});
          camera.goTo();
          sigInst.refresh();
          sigInst.loadCamera('main');
        }
      );
    }
    // // If the slide has changed, we try to apply the saved camera
    // else if (prev.currentSlide !== this.props.currentSlide) {
    //   sigInst.loadCamera('main', this.props.camera);
    // }
  }

  componentWillUnmount() {
    // Killing the renderer
    sigInst.killRenderer(this.renderer);
    // Releasing the camera
    // this.releaseCamera();
  }

  render() {
    return (
      <div id="sigma-container" ref={div => (this.container = div)} />
    );
  }
}

export default Graph;


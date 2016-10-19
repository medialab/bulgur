import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'lodash';

import * as duck from '../duck';
import {
  closeTakeAwayModal,
  selector as bulgurSelector
} from '../../Bulgur/duck';

import quinoa from '../../../helpers/configQuinoa';
import downloadFile from '../../../helpers/fileDownloader';

import TakeAwayDialogLayout from './TakeAwayDialogLayout';

@connect(
  state => ({
    ...duck.selector(state.takeAway),
    ...bulgurSelector(state.activeStory)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      closeTakeAwayModal
    }, dispatch)
  })
)
class TakeAwayDialogContainer extends Component {

  constructor(props) {
    super(props);
    this.takeAway = debounce(this.takeAway.bind(this), 300);
  }

  shouldComponentUpdate() {
    return false;
  }

  takeAway(takeAwayType) {
    const quinoaStory = quinoa.getState().editor;
    const project = {
      data: this.props.visualizationData.data,
      globalParameters: {
        parameters: this.props.visualizationData.parameters,
        visualizationType: this.props.visualizationData.visualizationType
      },
      story: {
        order: quinoaStory.order.slice(),
        slides: Object.keys(quinoaStory.slides).map(slideKey => {
          const slide = quinoaStory.slides[slideKey];
          return {
            id: slide.id,
            markdown: slide.markdown,
            title: slide.title,
            meta: Object.assign({}, slide.meta)
          };
        }).reduce((sl, slide) => {
          sl[slide.id] = slide;
          return sl;
        }, {})
      }
    };
    switch (takeAwayType.id) {
      case 'project':
        downloadFile(JSON.stringify(project, null, 2), 'json');
        break;
      case 'html':
        break;
      case 'github':
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <TakeAwayDialogLayout
        {...this.props}
        takeAway={this.takeAway} />
    );
  }
}

export default TakeAwayDialogContainer;

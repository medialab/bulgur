import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ProjectManagerLayout from './ProjectManagerLayout';
import * as duck from '../duck';
import * as globalDuck from '../../Bulgur/duck';

import {
  getFileAsText
} from '../../../helpers/fileLoader';

import validatePresentation from '../../../helpers/presentationValidator';

@connect(
  state => ({
    ...duck.selector(state.presentations)
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
      ...globalDuck
    }, dispatch)
  })
)
export default class ProjectManagerContainer extends Component {
  /**
   * constructor
   */
  constructor (props) {
    super(props);
    this.onProjectImportPrompt = this.onProjectImportPrompt.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  onProjectImportPrompt (files) {
    getFileAsText(files[0], (err, str) => {
      // todo : remove
      if (err) {
        this.props.actions.importFail('invalidProject');
      }
      else {
        try {
          const project = JSON.parse(str);
          const valid = validatePresentation(project);
          if (valid) {
            const existant = this.props.presentationsList.find(pres => pres.id === project.id);
            // has preexisting presentation, prompt for override
            if (existant !== undefined) {
              this.props.actions.promptOverrideImport(project);
            // has no preexisting presentation, importing
            }
 else {
              this.props.actions.importSuccess(project);
            }
          }
 else {
            this.props.actions.importFail('invalidProject');
          }
        }
 catch (e) {
          this.props.actions.importFail('badJSON');
        }
      }
    });
  }


  render () {
    const overrideImportWithCandidate = () => this.props.actions.importSuccess(this.props.importCandidate);
    return (
      <ProjectManagerLayout
        onDropInput={this.onProjectImportPrompt}
        overrideImportWithCandidate={overrideImportWithCandidate}
        {...this.props} />
    );
  }
}

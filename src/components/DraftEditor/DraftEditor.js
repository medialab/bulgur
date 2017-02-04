/* eslint react/no-set-state: 0 */
/**
 * Component rendering the Draft.js editor for a single slide.
 */
import React, {Component} from 'react';
import Editor from 'draft-js-plugins-editor';
import {RichUtils} from 'draft-js';

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';

const focusPlugin = createFocusPlugin();
const richButtonsPlugin = createRichButtonsPlugin();

import './DraftEditor.scss';

const {
  // inline buttons
  ItalicButton,
  BoldButton,
  // MonospaceButton,
  UnderlineButton,
  // block buttons
  ParagraphButton,
  BlockquoteButton,
  // CodeButton,
  // OLButton,
  ULButton,
  // H1Button,
  // H2Button,
  // H3Button,
  // H4Button,
  // H5Button,
  // H6Button
} = richButtonsPlugin;

export default class QuinoaDraftSlide extends Component {

  constructor (props) {
    super(props);

    // little hack to a bug generated by the editor plugin
    // which calls an illegitimate onChange when plugins are initialized
    // (https://github.com/draft-js-plugins/draft-js-plugins/issues/311)
    this.state = {
      initialized: false
    };
    this.onEditorChange = (arg) => {
      if (this.state.initialized) {
        this.props.update(arg);
      }
      else {
        this.setState({
          initialized: true
        });
      }
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.props.slide.draft, command);
    if (newState && typeof this.props.update === 'function') {
      this.onEditorChange({draft: newState});
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const {
      slide
    } = this.props;
    const onChange = state => this.onEditorChange({draft: state});
    return (
      <div className="bulgur-draft-editor">
        <div className="rich-buttons">
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />

          <ParagraphButton />
          <BlockquoteButton />
          <ULButton />
        </div>
        <Editor
          editorState={slide.draft}
          onChange={onChange}
          handleKeyCommand={this.handleKeyCommand}
          plugins={[
              focusPlugin,
              richButtonsPlugin
            ]} />
      </div>
    );
  }
}
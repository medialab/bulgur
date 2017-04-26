/* eslint react/no-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */
/**
 * This module provides a reusable draft-powered text wysiwig editor component
 * @module bulgur/components/DraftEditor
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Editor from 'draft-js-plugins-editor';
import {
  RichUtils,
  EditorState
} from 'draft-js';

import {stateFromMarkdown} from 'draft-js-import-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

const richButtonsPlugin = createRichButtonsPlugin();

import './DraftEditor.scss';


import {translateNameSpacer} from '../../helpers/translateUtils';

const {
  // inline buttons
  ItalicButton,
  BoldButton,
  // MonospaceButton,
  UnderlineButton,
  // block buttons
  // ParagraphButton,
  // BlockquoteButton,
  // CodeButton,
  // OLButton,
  // ULButton,
  // H1Button,
  // H2Button,
  // H3Button,
  // H4Button,
  // H5Button,
  // H6Button
} = richButtonsPlugin;

export default class QuinoaDraftSlide extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    // little hack to a bug generated by the editor plugin
    // which calls illegitimately onChange when plugins are initialized
    // (https://github.com/draft-js-plugins/draft-js-plugins/issues/311)
    this.state = {
      initialized: false,
      focused: false,
      editorState: props.slide && props.slide.markdown ? EditorState.createWithContent(stateFromMarkdown(props.slide.markdown)) : EditorState.createEmpty(),
      markdown: props.slide && props.slide.markdown ? props.slide.markdown : ''
    };

    this.onEditorChange = (editorState) => {
      if (this.state.initialized) {
        const markdown = stateToMarkdown(editorState.getCurrentContent());
        this.setState({
          editorState,
          markdown
        });
        this.props.update(markdown);
      }
      else {
        this.setState({
          initialized: true
        });
      }
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  componentWillReceiveProps() {
    // update editor if markdown representation of content is different between props and state
    if (this.props.slide && this.props.slide.markdown && this.props.slide.markdown !== this.state.markdown) {
      this.setState({
        editorState: EditorState.createWithContent(stateFromMarkdown(this.props.slide.markdown)),
        markdown: this.props.slide.markdown
      });
    }
  }

  shouldComponentUpdate() {
    return true;
    //this.state.markdown !== nextState.markdown;
  }

  componentDidUpdate() {
    if (this.props.slide && typeof this.props.slide.markdown === 'string' && this.props.slide.markdown !== this.state.markdown) {
      this.setState({
        editorState: EditorState.createWithContent(stateFromMarkdown(this.props.slide.markdown)),
        markdown: this.props.slide.markdown
      });
    }
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState && typeof this.props.update === 'function') {
      this.onEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.DraftEditor');
    const onChange = state => this.onEditorChange(state);
    const onGlobalClick = e => {
      e.stopPropagation();
      this.editorComponent.focus();
    };
    const onFocus = () => this.setState({focused: true});
    const onBlur = () => this.setState({focused: false});
    return (
      <div
        className={'bulgur-draft-editor ' + (this.state.focused ? 'focused' : '')}
        onClick={onGlobalClick}>
        <div className="rich-buttons">
          <div className="buttons-group">
            <BoldButton label={translate('bold')} />
            <ItalicButton label={translate('italic')} />
            <UnderlineButton label={translate('underline')} />
          </div>

          {/*
          <div className="buttons-group">
            <ParagraphButton />
            <BlockquoteButton />
            <ULButton>List</ULButton>
          </div>
        */}
        </div>
        <Editor
          editorState={this.state.editorState}
          onChange={onChange}
          handleKeyCommand={this.handleKeyCommand}
          placeholder={translate('write-your-slide-comment-here')}
          ref={(editorComponent) => {
this.editorComponent = editorComponent;
}}
          onFocus={onFocus}
          onBlur={onBlur}
          plugins={[
              richButtonsPlugin
            ]} />
      </div>
    );
  }
}

/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable text area element component
 * wrapping its change callback in a debounce
 * @module bulgur/components/DebouncedTextArea
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import Textarea from 'react-textarea-autosize';


/**
 * DebouncedTextArea class for building react component instances
 */
export default class DebouncedTextArea extends Component {

  /**
   * Component's properties types
   */
  propTypes = {

    /**
     * the current value of the input
     */
    value: PropTypes.string,

    /**
     * the placeholder to display
     */
    placeHolder: PropTypes.string,

    /**
     * callbacks when value is changed by user
     */
    onChange: PropTypes.func,
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.onChange = debounce(this.onChange, 1000);
    this.state = {
      value: this.props.value
    };
  }


  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }


  /**
   * Handles the onChange callback in a secure way
   * @param {string} value - the value to callback
   */
  onChange(value) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      children,
      placeholder
    } = this.props;
    const {
      value
    } = this.state;

    const onTextAreaChange = e => {
      const thatValue = e.target.value;
      this.setState({
        value: thatValue
      });
      this.onChange(thatValue);
    };

    return (
      <Textarea
        type="text"
        onChange={onTextAreaChange}
        value={value}
        placeholder={placeholder}>
        {children}
      </Textarea>
    );
  }
}

/* eslint react/no-set-state: 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import Textarea from 'react-textarea-autosize';

export default class DebouncedTextArea extends Component {

  propTypes = {
    value: PropTypes.string,
    placeHolder: PropTypes.string,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onChange = debounce(this.onChange, 1000);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  onChange(value) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

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

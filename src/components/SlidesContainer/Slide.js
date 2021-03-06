/* eslint react/no-find-dom-node:0 */
/**
 * This module provides a reusable draggable slide component
 * @module bulgur/components/Slide
 */
import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import {DragSource, DropTarget} from 'react-dnd';

import {translateNameSpacer} from '../../helpers/translateUtils';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import DebouncedTextarea from '../DebouncedTextarea/DebouncedTextarea';


/**
 * react-dnd drag & drop handlers
 */

/**
 * drag source handler
 */
const slideSource = {
  beginDrag(props) {
    return {
      id: props.slideKey,
      index: props.slideIndex
    };
  }
};

/**
 * drag target handler
 */
const slideTarget = {

  /**
   * Drag on hover behavior
   * Initial design & implementation @yomguithereal
   * (https://github.com/medialab/quinoa/blob/master/src/components/draggable.js)
   */
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index,
          hoverIndex = props.slideIndex;
    // If itself, we break
    if (dragIndex === hoverIndex)
      return;

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.onMove(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};


/**
 * These two decorators allow to drag and drop the card
 * thanks to react-dnd
 * see https://react-dnd.github.io/react-dnd/
 */
@DragSource('SLIDE', slideSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget('SLIDE', slideTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))

/**
 * Slide class for building react component instances
 */
class Slide extends React.Component {

  /**
   * Component's used context data
   */
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.Slide');
    const {
      slide = {},
      active,
      onRemove,
      onGlobalClick,
      onTitleChange,
      onTextChange,
      onDuplicateSlide,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      isDragging,
      isOver
    } = this.props;
    const handleClick = (e) => {
      e.stopPropagation();
      if (!isDragging) {
        onGlobalClick();
      }
    };
    return connectDragPreview(connectDropTarget(
      <li
        className={'bulgur-slide ' + (active ? 'active ' : ' ') + (isDragging ? 'dragged ' : ' ') + (isOver ? 'drag-hovered ' : ' ')}
        onClick={handleClick}>
        <div className="slide-content">
          <h3>
            <DebouncedInput
              placeholder={translate('slide-title')}
              value={slide.title}
              onChange={onTitleChange} />
          </h3>
          <div className="comment-container">
            <DebouncedTextarea
              placeholder={translate('slide-comment')}
              maxRows={15}
              value={slide.markdown}
              onChange={onTextChange} />
          </div>
          <div className="operations-container">
            {connectDragSource(<button className="move-btn">■ {translate('move')}</button>)}
            <button onClick={onDuplicateSlide}>⎘ {translate('duplicate')}</button>
            <button className="remove-btn" onClick={onRemove}>⌫ {translate('remove')}</button>
          </div>
        </div>
      </li>
    ));
  }
}


/**
 * Component's properties types
 */
Slide.propTypes = {

  /**
   * slide to display
   */
  slide: PropTypes.object,

  /**
   * whether the slide is edited
   */
  active: PropTypes.bool,

  /**
   * callbacks when slide asks to be removed
   */
  onRemove: PropTypes.func,

  /**
   * callbacks when slide is clicked
   */
  onGlobalClick: PropTypes.func,

  /**
   * callbacks when slide title is changed
   */
  onTitleChange: PropTypes.func,

  /**
   * callbacks when slide text is changed
   */
  onTextChange: PropTypes.func,

  /**
   * callbacks when slide asks to be duplicated
   */
  onDuplicateSlide: PropTypes.func,

  /**
   * callbacks when slide is asked to be dragged
   */
  connectDragSource: PropTypes.func,

  /**
   * callbacks when slide is asked to be previewed
   */
  connectDragPreview: PropTypes.func,

  /**
   * callbacks when slide is dropped
   */
  connectDropTarget: PropTypes.func,

  /**
   * represents whether slide is dragged
   */
  isDragging: PropTypes.bool,

  /**
   * represent whether slide is hovered
   */
  isOver: PropTypes.bool,
};

export default Slide;

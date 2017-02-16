/* eslint react/no-find-dom-node:0 */
/**
 * This module provides a reusable draggable slide component
 * @module bulgur/components/Slide
 */
import React from 'react';
import {findDOMNode} from 'react-dom';

import Textarea from 'react-textarea-autosize';

import {DragSource, DropTarget} from 'react-dnd';

const slideSource = {
  beginDrag(props) {
    return {
      id: props.slideKey,
      index: props.slideIndex
    };
  }
};

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

@DragSource('SLIDE', slideSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget('SLIDE', slideTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
class Slide extends React.Component {
  render() {
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
    const handleClick = () => {
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
            <input
              placeholder="slide title"
              type="text"
              value={slide.title}
              onChange={onTitleChange} />
          </h3>
          <div className="comment-container">
            <Textarea
              placeholder="slide comment"
              maxRows={15}
              value={slide.markdown}
              onChange={onTextChange} />
          </div>
          <div className="operations-container">
            {connectDragSource(<button>■ Move</button>)}
            <button onClick={onDuplicateSlide}>⎘ Duplicate</button>
            <button className="remove-btn" onClick={onRemove}>⌫ Remove</button>
          </div>
        </div>
      </li>
    ));
  }
}

export default Slide;

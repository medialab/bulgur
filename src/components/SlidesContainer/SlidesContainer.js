/* eslint react/prefer-stateless-function:0 */
/**
 * This module provides a reusable slides container component
 * @module bulgur/components/SlidesContainer
 */

import React from 'react';
import PropTypes from 'prop-types';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Slide from './Slide';
import './SlidesContainer.scss';

import {translateNameSpacer} from '../../helpers/translateUtils';

/**
 * SlidesContainer class for building react component instances
 */
class SlidesContainer extends React.Component {

  /**
   * Component's context used properties
   */
  static contextTypes = {
    t: PropTypes.func.isRequired
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.SlidesContainer');
    const {
      activePresentation,
      activeSlideId,
      setActiveSlide,
      addSlide,
      updateSlide,
      moveSlide,
      duplicateSlide,
      removeSlide
    } = this.props;
    return (
      <ul className="bulgur-SlidesContainer">
        {
        activePresentation &&
        activePresentation
        .order
        .map((slideKey, slideIndex) => {
            const slide = activePresentation.slides[slideKey];
            const onRemove = e => {
              e.stopPropagation();
              removeSlide(slideKey);
            };
            const onGlobalClick = () => {
              if (activeSlideId !== slideKey) {
                setActiveSlide(slideKey, slide);
              }
            };

            const onTitleChange = (title) => {
              updateSlide(slideKey, {
                ...slide,
                title
              });
            };
            const onTextChange = markdown => {
              updateSlide(slideKey, {
                ...slide,
                markdown
              });
            };
            const onDuplicateSlide = () => {
              duplicateSlide(slide, slideIndex);
            };
            const onMove = (from, to) => {
              moveSlide(from, to);
            };
            return (
              <Slide
                key={slideKey}
                slide={slide}
                slideKey={slideKey}
                slideIndex={slideIndex}
                active={activeSlideId === slideKey}
                onMove={onMove}
                onRemove={onRemove}
                onGlobalClick={onGlobalClick}
                onTitleChange={onTitleChange}
                onTextChange={onTextChange}
                onDuplicateSlide={onDuplicateSlide} />
            );
          }
          )
      }
        <li className="add-slide">
          <button
            className={activePresentation
          && activePresentation.order
          && activePresentation.order.length === 0 ? 'first-slide' : ''} type="button" onClick={addSlide}>
            {activePresentation
          && activePresentation.order
          && activePresentation.order.length === 0 ?
          '+ ' + translate('click-to-add-first-slide') :
          '+ ' + translate('add-slide')
        }</button>
        </li>
      </ul>
  );
  }
}


/**
 * Component's properties types
 */
SlidesContainer.propTypes = {

  /**
   * presentation being edited
   */
  activePresentation: PropTypes.object,

  /**
   * id of the active slide
   */
  activeSlideId: PropTypes.string,

  /**
   * sets the active slide
   */
  setActiveSlide: PropTypes.func,

  /**
   * callbacks for adding a slide
   */
  addSlide: PropTypes.func,

  /**
   * callbacks for updating a specific slide
   */
  updateSlide: PropTypes.func,

  /**
   * callbacks for setting a specific slide
   */
  moveSlide: PropTypes.func,

  /**
   * callbacks for duplicating a slide
   */
  duplicateSlide: PropTypes.func,

  /**
   * callbacks for removing a slide
   */
  removeSlide: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(SlidesContainer);

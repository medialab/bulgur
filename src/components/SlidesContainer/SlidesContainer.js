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

class SlidesContainer extends React.Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }
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

            const onTitleChange = (e) => {
              updateSlide(slideKey, {
                ...slide,
                title: e.target.value
              });
            };
            const onTextChange = (e) => {
              updateSlide(slideKey, {
                ...slide,
                markdown: e.target.value
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
export default DragDropContext(HTML5Backend)(SlidesContainer);

/**
 * This module provides a reusable slides container component
 * @module bulgur/components/SlidesContainer
 */

import React from 'react';
import Textarea from 'react-textarea-autosize';

import './SlidesContainer.scss';

const SlidesContainer = ({
  activePresentation,
  activeSlideId,
  setActiveSlide,
  addSlide,
  updateSlide,
  removeSlide
}) => {
  return (
    <ul className="bulgur-slides-container">
      {
        activePresentation &&
        activePresentation
        .order
        .map(slideKey => {
            const slide = activePresentation.slides[slideKey];
            const onRemove = () => removeSlide(slideKey);
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
                markdown: e.target.value,
                draft: undefined
              });
            };
            return (
              <li className={'bulgur-slide ' + (activeSlideId === slideKey ? 'active' : '')} onClick={onGlobalClick} key={slideKey}>
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
                    <button>■ Move</button>
                    <button>⎘ Duplicate</button>
                    <button className="remove-btn" onClick={onRemove}>⌫ Remove</button>
                  </div>
                </div>
              </li>
            );
          }
          )
      }
      <li className="add-slide">
        <button type="button" onClick={addSlide}>Add slide</button>
      </li>
    </ul>
  );

};

export default SlidesContainer;

import React from 'react';

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
                <h3>
                  <input
                    placeholder="slide title"
                    type="text"
                    value={slide.title}
                    onChange={onTitleChange} />
                  <button onClick={onRemove}>x</button>
                </h3>
                <div className="comment-container">
                  <textarea
                    type="text"
                    placeholder="slide comment"
                    value={slide.markdown}
                    onChange={onTextChange} />
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

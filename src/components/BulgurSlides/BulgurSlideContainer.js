import React from 'react';

const BulgurSlidesContainer = ({
  activePresentation,
  activeSlideId,
  setActiveSlide,
  addSlide,
  updateSlide,
  removeSlide
}) => {
  return (
    <ul className="bulgur-slides">
      {
        activePresentation &&
        activePresentation
        .order
        .map(slideKey => {
            const slide = activePresentation.slides[slideKey];
            const onRemove = () => removeSlide(slideKey);
            const onGlobalClick = () => setActiveSlide(slideKey, slide);

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
              <li className="bulgur-slide" onClick={onGlobalClick} key={slideKey}>
                <h3>
                  <input
                    placeholder="slide title"
                    type="text"
                    value={slide.title}
                    onChange={onTitleChange} />
                </h3>
                <div>
                  <textarea
                    type="text"
                    placeholder="slide comment"
                    value={slide.markdown}
                    onChange={onTextChange} />
                </div>
                <button onClick={onRemove}>Remove slide</button>
                {activeSlideId === slideKey ? 'active' : ''}
              </li>
            );
          }
          )
      }
      <li>
        <button type="button" onClick={addSlide}>Add slide</button>
      </li>
    </ul>
  );

};

export default BulgurSlidesContainer;

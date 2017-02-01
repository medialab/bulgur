import React from 'react';

import './AsideViewLayout.scss';

// import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

// import {quinoaCreateComponents} from 'quinoa';
// const EditorComponent = quinoaCreateComponents().editor;

const AsideViewLayout = ({
  openSettings,
  activePresentation = {},
  returnToLanding,
  addSlide,
  removeSlide,
  setActiveSlide,
  activeSlideId,
  updateSlide
}) => (
  <aside className="bulgur-aside-view">
    <h1>
      <button onClick={openSettings} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> {activePresentation.metadata && activePresentation.metadata.title && activePresentation.metadata.title.length ? activePresentation.metadata.title : 'untitled presentation'}</button>
    </h1>
    {/* <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New presentation / import</button> */}
    {/*<EditorComponent />*/}
    <ul className="slides-container">
      {
        activePresentation.order &&
        activePresentation
          .order.map((slideKey) => {
            const onRemove = () => removeSlide(slideKey);
            const slide = activePresentation.slides[slideKey];
            const onGlobalClick = () => setActiveSlide(slideKey);

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
            return (
              <li onClick={onGlobalClick} key={slideKey}>
                <h3>
                  <input type="text" value={slide.title} onChange={onTitleChange} />
                </h3>
                <div>
                  <textarea type="text"
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
    </ul>
    <button type="button" onClick={addSlide}>Add slide</button>
    <button type="button" onClick={returnToLanding}>← Home</button>
  </aside>
);

export default AsideViewLayout;

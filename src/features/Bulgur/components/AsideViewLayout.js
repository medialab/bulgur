import React from 'react';
import ReactMarkdown from 'react-markdown';

import './AsideViewLayout.scss';

import {EditorComponent} from '../../../helpers/configQuinoa';

import 'codemirror/lib/codemirror.css';
import '../../../lib/code-mirror-theme.scss';

import quinoa from '../../../helpers/configQuinoa';

const AsideViewLayout = ({
  openNewStoryModal,
  openTakeAwayModal,
  returnToLanding,
  isReadOnly
}) => (
  <aside className="bulgur-aside-view">
    {isReadOnly ? <h1>Bulgur</h1> : ''}
    {isReadOnly ? '' : <button onClick={returnToLanding} type="button"><img className="bulgur-icon-image" src={require('../assets/landing.svg')} />New story / import</button>}
    {isReadOnly ? '' : <button onClick={openNewStoryModal} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> Story settings</button>}
    {isReadOnly ?
      <ul className="quinoa-readonly-container">
        {quinoa.getState().editor.order
            .map(id => quinoa.getState().editor.slides[id])
            .map((slide, index) => {
              const onSlideClick = () => quinoa.actions.selectSlide(slide.id);
              return (
                <li className={'quinoa-readonly-slide' + (quinoa.getState().editor.current === slide.id ? ' active' : '')} onClick={onSlideClick} key={index}>
                  <h1>{slide.title}</h1>
                  <ReactMarkdown source={slide.markdown} />
                </li>
          );})}
      </ul> : <EditorComponent />}
    {isReadOnly ? '' : <button type="button" onClick={openTakeAwayModal}><img className="bulgur-icon-image" src={require('../assets/take-away.svg')} /> Take away</button>}
  </aside>
);


export default AsideViewLayout;

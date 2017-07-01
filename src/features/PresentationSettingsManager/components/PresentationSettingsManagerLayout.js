/**
 * This module exports a stateless component rendering the layout of the story settings manager interface
 * @module fonio/features/PresentationSettingsManager
 */
import React from 'react';
import PropTypes from 'prop-types';

import TextArea from 'react-textarea-autosize';
import PresentationPlayer, {templates} from 'quinoa-presentation-player';


import './PresentationSettingsManagerLayout.scss';

import {translateNameSpacer} from '../../../helpers/translateUtils';

import OptionSelect from '../../../components/OptionSelect/OptionSelect';

const PresentationSettingsManagerLayout = ({
  activePresentation,
  activePresentationId,
  settingsVisible,
  activeSlideId,

  actions: {
    setPresentationCss,
    setPresentationSettingOption,
    setSettingsVisibility,
    setPresentationTemplate,
  }
}, context) => {
  // namespacing the translation keys
  const translate = translateNameSpacer(context.t, 'Features.PresentationSettingsManager');
  const activeCss = (activePresentation && activePresentation.settings && activePresentation.settings.css) || '';
  const activeTemplate = (activePresentation && activePresentation.settings && activePresentation.settings.template) || 'stepper';
  // const activeTemplateData = templates.find(template => template.id === activeTemplate);

  const toggleSettingsVisibility = () => {
    if (settingsVisible) {
      setSettingsVisibility(false);
    }
    else setSettingsVisibility(true);
  };

  const onTemplateChange = value => {
    setPresentationTemplate(activePresentationId, value);
  };
  const onCssChange = e => {
    const css = e.target.value;
    setPresentationCss(activePresentationId, css);
  };

  return (
    <section className="fonio-PresentationSettingsManagerLayout">
      <aside className={'settings-pannel ' + (settingsVisible ? 'visible' : 'hidden')}>
        <div
          className="settings-pannel-header"
          onClick={toggleSettingsVisibility}>
          <h1>
            <span>{translate('story-settings-title')}</span>
            {settingsVisible && <img className="fonio-icon-image" src={require('../../../sharedAssets/close-black.svg')} />}
          </h1>
        </div>
        <div className="settings-pannel-body">
          <section className="settings-section">
            <h2>{translate('template-title')}</h2>
            <OptionSelect
              title={translate('choose-a-template')}
              options={templates.map(template => ({
              value: template.id,
              label: template.name
            }))}
              onChange={onTemplateChange}
              activeOptionId={activeTemplate} />
          </section>
          <section className="settings-section">
            <h2>{translate('customize-css-title')}</h2>
            <div className="css-customizer-container">
              <TextArea
                minRows={10}
                maxRows={12}
                defaultValue="Write custom css code here"
                value={activeCss}
                onChange={onCssChange} />
              {!activeCss.length &&
              <pre className="css-example">

                <code>
                  {`Example:
.quinoa-presentation-player{
  color: red;
}`}
                </code>
              </pre>
            }
            </div>
          </section>
        </div>
      </aside>
      <section className="preview-container">
        <PresentationPlayer
          presentation={activePresentation}
          beginAt={activePresentation.order.indexOf(activeSlideId)}
          template={activeTemplate} />
      </section>
    </section>
  );
};

PresentationSettingsManagerLayout.contextTypes = {
  t: PropTypes.func.isRequired,
};


export default PresentationSettingsManagerLayout;

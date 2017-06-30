/**
 * This module provides a reusable lang toggler component
 * @module bulgur/components/LangToggler
 */
import React from 'react';

import './LangToggler.scss';

const LangToggler = ({
  lang,
  onChange
}) => {
  const otherLang = lang === 'en' ? 'fr' : 'en';
  const onClick = () => {
    if (lang === 'en') {
     onChange('fr');
    }
    else {
      onChange('en');
    }
  };
  return (
    <button onClick={onClick} className="bulgur-LangToggler">
      <span className="active">{lang}</span>/<span>{otherLang}</span>
    </button>
  );
};

export default LangToggler;

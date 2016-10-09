import React from 'react';

require('./BulgurSlideThumbnail.scss');

const BulgurSlideThumbnail = ({children}) => (
  <li className="bulgur-slide-thumbnail">
    {children}
  </li>
);
export default BulgurSlideThumbnail;
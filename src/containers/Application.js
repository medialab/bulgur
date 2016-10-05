/**
 * Bulgur Application Component
 * =======================================
 *
 * Root component of the application.
 */
import React from 'react';
import AsideContainer from '../components/AsideContainer';
import MainContainer from '../components/MainContainer';

export default function Application(props) {

  return (
    <div id="wrapper" className="bulgur">
      <AsideContainer/>
      <MainContainer/>
    </div>
  );
}

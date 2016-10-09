import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';

import SlideThumbnail from '../src/components/BulgurSlideThumbnail/BulgurSlideThumbnail';

import Welcome from './Welcome';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('Thumbnail', module)
  .add('empty', () => (
    <SlideThumbnail></SlideThumbnail>
  ))
  .add('short text', () => (
    <SlideThumbnail>My slide title</SlideThumbnail>
  ))
  .add('long text', () => (
    <SlideThumbnail>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</SlideThumbnail>
  ))
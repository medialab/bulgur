import Quinoa from 'quinoa';
import {EditorState} from 'draft-js';
import {createStructuredSelector} from 'reselect';
import uuid from 'uuid';

import '../lib/quinoa.scss';

function createStartupSlide(data = {}) {
  return {
    id: uuid.v4(),
    title: data.title || '',
    markdown: data.markdown || '',
    draft: EditorState.createEmpty(),
    meta: {
      parameters: 'ok'
    }
  };
}

function createEditorState(slides = []) {
  const slidesMap = {};

  slides.forEach(slide => (slidesMap[slide.id] = slide));

  return {
    current: slides.length ? slides[0].id : 0,
    slides: slidesMap,
    order: slides.map(slide => slide.id)
  };
}

function createQuinoaState(slides = []) {
  return {
    editor: createEditorState(slides)
  };
}

const QUINOA_DEFAULT_STATE = createQuinoaState([
  createStartupSlide({
    title: 'Hello'
  })
]);

const quinoa = new Quinoa({
  defaultState: QUINOA_DEFAULT_STATE,
  slideCreator: createStartupSlide
});

export function plugQuinoa(renderApplication) {
  quinoa.subscribe(renderApplication);
  quinoa.hot(renderApplication);
}

export const EditorComponent = quinoa.getEditorComponent();
export const DraftComponent = quinoa.getDraftComponentForSlide();

function mapStore(quinoaLib) {
  const {editor} = quinoaLib.getState();
  const currentSlide = editor.slides[editor.current];

  return {
    currentSlide: editor.current,
    slideParameters: currentSlide ? currentSlide.meta : {}
  };
}

export const actions = quinoa.getActions();

export const state = mapStore(quinoa);

const currentSlide = thatState => thatState.currentSlide;

const slideParameters = thatState => thatState.slideParameters;

export const selector = createStructuredSelector({
  currentSlide,
  slideParameters
});


export default quinoa;

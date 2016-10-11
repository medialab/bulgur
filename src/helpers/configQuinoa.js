import Quinoa from 'quinoa';
import {EditorState} from 'draft-js';
import uuid from 'uuid';

function createStartupSlide(data) {
  return {
    id: uuid.v4(),
    title: data.title || '',
    markdown: data.markdown || '',
    draft: EditorState.createEmpty()
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

const QUINOA_DEFAULT_STATE = createQuinoaState([]);

let quinoa;

export function initQuinoa(renderApplication) {
  quinoa = new Quinoa({
    defaultState: QUINOA_DEFAULT_STATE,
    slideCreator: createStartupSlide
  });
  window.quinoa = quinoa;
  quinoa.subscribe(renderApplication);
  quinoa.hot(renderApplication);
}

export default quinoa;
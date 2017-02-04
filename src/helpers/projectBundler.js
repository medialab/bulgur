import {post} from 'superagent';
import {serverUrl} from '../../secrets';

export function cleanPresentationForExport(presentation) {
  return {
    ...presentation,
    slides: Object.keys(presentation.slides).reduce((slides, id) => {
      const slide = presentation.slides[id];
      slide.id = id;
      delete slide.draft;
      return {
        ...slides,
        [id]: slide
      };
    }, {})
  };
}

export function bundleProjectAsHtml (presentation, callback) {
  post(serverUrl + '/render-presentation')
    .send(cleanPresentationForExport(presentation))
    .end((err, response) => callback(err, response && response.text));
}

export function bundleProjectAsJSON (presentation) {
  return JSON.stringify(cleanPresentationForExport(presentation), null, 2);
}

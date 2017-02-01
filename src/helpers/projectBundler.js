import {post} from 'superagent';
import {serverUrl} from '../../secrets';

export function bundleProjectAsHtml (presentation, callback) {
  post(serverUrl + '/render-presentation')
    .send(presentation)
    .end((err, response) => callback(err, response && response.text));
}

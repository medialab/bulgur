import {patch} from 'superagent';

import {serverUrl} from '../../secrets';

export default function publishToServer (presentation, dispatch, statusActionName) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: statusActionName,
      message: 'publishing to server',
      status: 'processing'
    });
    patch(serverUrl + '/presentations/' + presentation.id)
      .send(presentation)
      .end((err) => {
          if (err) {
            return reject(err);
          }
          else {
            return resolve({status: 'ok'});
          }
        });
    });
}

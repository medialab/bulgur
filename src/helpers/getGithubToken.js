/**
 * This module helps to get a token from github oAuth service
 * @module bulgur/utils/getGithubToken
 */
import {post} from 'superagent';

import {githubAPIClientId, serverUrl, appUrl} from '../../secrets';

/**
 * @return {promise} promise - the promise wrapping the attempt
 */
export default function getGithubToken () {
  return new Promise((resolve, reject) => {
    // open login form
    window.open('https://github.com' +
    '/login/oauth/authorize' +
    '?client_id=' + githubAPIClientId +
    '&scope=gist&redirect_url=' + appUrl);
    // get code from oauth response
    window.addEventListener('message', function (event) {
      const code = event.data;
      if (typeof code === 'string') {
        // exchange the code for a token
        post(serverUrl + '/oauth-proxy')
        .set('Accept', 'application/json')
        .send({code})
        .end((err, response) => {
          if (err) {
            reject(err);
          }
          else {
            try {
              const jsonResp = JSON.parse(response.text);
              const accessToken = jsonResp.access_token;
              resolve(accessToken);
            }
            catch (e) {
              reject(e);
            }
          }
        });
      }
 else {
        reject();
      }
    });
  });
}

import {post} from 'superagent';

import {githubAPIClientId, githubTokenProviderUrl} from '../../secrets';

export default function getGithubToken () {
  return new Promise((resolve, reject) => {
    // open login form
    window.open('https://github.com' +
    '/login/oauth/authorize' +
    '?client_id=' + githubAPIClientId +
    '&scope=gist&redirect_url=http://bulgur.surge.sh');
    // get code from oauth response
    window.addEventListener('message', function (event) {
      const code = event.data;
      if (typeof code === 'string') {
        // exchange the code for a token
        post(githubTokenProviderUrl)
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
    });
  });
}

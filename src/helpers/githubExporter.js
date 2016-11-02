import GitHub from 'github-api';
import {OAuth} from 'oauthio-web';
import {oauth_io_public_key as oKey} from '../../secrets';

OAuth.initialize(oKey);

export default function publishGist(fileContent, dispatch, statusActionName) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: statusActionName,
      status: 'connecting to github'
    });
    OAuth.popup('github')
    .done(function(loginResult) {
      const token = loginResult.access_token;
      dispatch({
        type: statusActionName,
        status: 'getting user gists'
      });
      loginResult.me().done((userData) => {
        const userName = userData.alias;
        // token auth
        const gh = new GitHub({
           token,
           username: userName
        });

        const gistContent = {
          description: 'my bulgur project',
          public: true,
          files: {
            'index.html': {
              content: fileContent
            }
          }
        };
        dispatch({
          type: statusActionName,
          status: 'creating gist'
        });
        const gist = gh.getGist();
        gist.create(gistContent)
          .then(() => {
            return gist.read();
          })
          .then(response => {
            const gistData = response.data;
            const blocksUrl = 'https://bl.ocks.org/' + userName + '/raw/' + gistData.id;
            const gistUrl = gistData.html_url;
            const results = {
              blocksUrl,
              gistUrl,
              gist
            };
            return resolve(results);
          })
          .catch(reject);
      });
    })
    .fail(reject);
  });
}

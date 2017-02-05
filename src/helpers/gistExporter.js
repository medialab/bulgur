import GitHub from 'github-api';

import getGithubToken from './getGithubToken';

export default function publishGist(htmlContent = '', JSONbundle = {}, dispatch, statusActionName, gistId) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: statusActionName,
      message: 'connecting to github',
      status: 'processing'
    });

    getGithubToken()
    .then(token => {
      const gh = new GitHub({
         token
      });
      const gistContent = {
        description: (JSONbundle && JSONbundle.metadata && JSONbundle.metadata.title) || 'quinoa presentation',
        public: true,
        files: {
          'index.html': {
            content: htmlContent
          },
          'project.json': {
            content: JSON.stringify(JSONbundle, null, 2)
          }
        }
      };
      if (gistId) {
        dispatch({
          type: statusActionName,
          message: 'updating gist',
          status: 'processing'
        });
      }
      else {
        dispatch({
          type: statusActionName,
          message: 'creating gist',
          status: 'processing'
        });
      }
      const gist = gh.getGist(gistId);

      gist.create(gistContent)
        .then(() => {
          return gist.read();
        })
        .then(response => {
          const gistData = response.data;
          const ownerName = gistData.owner.login;
          const blocksUrl = 'https://bl.ocks.org/' + ownerName + '/raw/' + gistData.id;
          window.open(blocksUrl, '_blank');
          const gistUrl = gistData.html_url;
          const results = {
            blocksUrl,
            gistUrl,
            gistId: gistData.id,
            gist
          };
          return resolve(results);
        })
        .catch(reject);
    })
    .catch(reject);
  });
}

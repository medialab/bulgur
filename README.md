# WIP

Bulgur is a tool dedicated to the making of *data presentations*, that is guided tours into data visualizations.
Users import their data from their computer, then compose their presentation, then export it to static html or to a web publication.

Bulgur is part of the ``quinoa`` project family, a suite of tools for digital storytelling tailored for the [FORCCAST](https://forccast.hypotheses.org/) pedagogical program and [médialab sciences po](http://www.medialab.sciences-po.fr/) scientific activities.

# Requirements

* [git](https://git-scm.com/)
* [node](https://nodejs.org/en/)
* [API secret and user ID for your implementation of the application](https://github.com/settings/applications/new) if you plan to enable gist exports

# Installation

```
git clone https://github.com/medialab/bulgur
cd bulgur
npm install
cp secrets.sample.json secrets.json
```

Then edit the ``secrets.json`` file with your own data.

# Development

```
npm run dev
```

# Deployment

Bulgur is a static web application, which means it does not need a server of its own for working.

For now Bulgur deploys to a [surge](http://surge.sh/) instance for preproduction tests.

Bulgur needs an instance of `[quinoa server](https://github.com/medialab/quinoa-server)` server application available to be able to handle all-in-one html bundling, oAuth connection to github/gist and server exports.
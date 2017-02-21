# WIP

Bulgur is a tool dedicated to the making of guided tours into data visualizations, called *data presentations*.
Users import their data from their computer, then compose their data presentation, then finally export it to static html or to a web publication.

Users personal data is stored on the `localStorage` of the user's browser, nevertheless it can also be synchronized with a [gist](https://gist.github.com/) code repository or with a distant backend server.

Bulgur is part of the ``quinoa`` project family, a suite of digital storytelling tools tailored for the [FORCCAST](https://forccast.hypotheses.org/) pedagogical program and [médialab sciences po](http://www.medialab.sciences-po.fr/) scientific activities.

# Features

Create a new presentation :

* set presentation-level metadata which will be consumed for SEO-friendly html outputs
* set dataset-level metadata
* choose a visualization type and initial visualization settings

Import a presentation :

* import from a presentation json file
* import from a forccast or gist url

Configure views in slides :

* set camera position
* set column-to-parameter settings
* set colors for categories of objects
* set visual filtering for specific categories of objects

Write and manage slides :

* create, move or duplicate slides
* edit comments in markdown or wysiwig editors
* capture specific visualization views for each slide

Keep your data on your browser or synchronize it with distant sources :

* store data on browser's local storage
* import and export data relative to a specific presentation from a forccast server repository
* import and export data relative to a specific presentation from a gist repository

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

Bulgur is compatible with the [Redux Devtools](https://github.com/gaearon/redux-devtools) browser extension for an optimal developer experience.

# Deployment

For now Bulgur deploys to a [surge](http://surge.sh/) instance for preproduction tests. If you plan to do the same, be sure to change the `CNAME` file to your own destination, then :

```
npm run deploy
```

Bulgur does not need a backend for composing presentations and storing them on the localStorage. Nevertheless, Bulgur needs an instance of [quinoa server](https://github.com/medialab/quinoa-server) application available in order to be able to handle all-in-one html bundling, oAuth connection to github/gist and exports to distant server.

/**
 * This module exports the models related to visualization types (mappable values, parameters, default values, example files, ...)
 * @module bulgur/models/visualizationTypes
 */
const models = {
  timeline: {
    type: 'timeline',
    acceptedFileExtensions: ['csv'],
    dataMap: {
      main: {
        'name': {
          id: 'name',
          acceptedValueTypes: ['string', 'number']
        },
        'category': {
          id: 'category',
          acceptedValueTypes: ['string', 'number']
        },
        'year': {
          id: 'year',
          acceptedValueTypes: ['number']
        },
        'month': {
          id: 'month',
          acceptedValueTypes: ['number']
        },
        'day': {
          id: 'day',
          acceptedValueTypes: ['number']
        },
        'time': {
          id: 'time',
          acceptedValueTypes: ['string']
        },
        'end year': {
          id: 'end year',
          acceptedValueTypes: ['number']
        },
        'end month': {
          id: 'end month',
          acceptedValueTypes: ['number']
        },
        'end day': {
          id: 'end day',
          acceptedValueTypes: ['number']
        },
        'end time': {
          id: 'end time',
          acceptedValueTypes: ['string']
        },
      }
    },
    samples: [
    {
      title: 'Milestones in the history of data visualization',
      fileName: 'milestones-history-datavis.csv',
      description: 'More information: http://www.datavis.ca/'
    }
    ],
    defaultViewParameters: {
      fromDate: new Date().setFullYear(1900),
      toDate: new Date().setFullYear(1960),
    },
    slideParameters: [
      {
        id: 'fromDate',
        default: new Date() - 1000 * 3600 * 24 * 365
      },
      {
        id: 'toDate',
        default: new Date().getTime()
      }
    ]
  },
  map: {
    type: 'map',
    acceptedFileExtensions: ['csv', 'geojson'],
    dataMap: {
      main: {
        title: {
          id: 'title',
          acceptedValueTypes: ['string']
        },
        category: {
          id: 'category',
          acceptedValueTypes: ['string', 'number']
        }
      }
    },
    samples: [
      {
        title: 'Histoire du Fort et des combats de 1870-1871 à Issy',
        fileName: 'histoiredufort.csv',
        description: 'Plus d\'informations: http://data.issy.com/explore/dataset/histoiredufort-feuille1/export/?disjunctive.refqr'
      },
      {
        title: 'Places',
        fileName: 'places.csv',
        description: 'Some cities coordinates'
      }
    ],
    slideParameters: [
      {
        id: 'cameraX',
        default: 48.8674345
      },
      {
        id: 'cameraY',
        default: 2.3455482
      },
      {
        id: 'cameraZoom',
        default: 10
      }
    ],
    defaultViewParameters: {
      cameraX: 48.8674345,
      cameraY: 2.3455482,
      cameraZoom: 4,
      tilesUrl: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'
    },
  },
  network: {
    type: 'network',
    acceptedFileExtensions: ['gexf', 'json', 'graphml'],
    samples: [
      {
        title: 'Arctic',
        fileName: 'arctic.gexf',
        description: 'Taken from quinoa examples'
      },
      {
        title: 'Les misérables',
        fileName: 'miserables.json',
        description: 'Taken from d3 examples (todo : document more)'
      }
    ],
    dataMap: {
      nodes: {
        label: {
          id: 'label',
          acceptedValueTypes: ['string', 'number'],
        },
        category: {
          id: 'category',
          acceptedValueTypes: ['string', 'number'],
        },
        description: {
          id: 'description',
          acceptedValueTypes: ['string'],
        },
        size: {
          id: 'size',
          acceptedValueTypes: ['number'],
        }
      },
      edges: {
        label: {
          id: 'label',
          acceptedValueTypes: ['string', 'number'],
        },
        type: {
          id: 'type',
          acceptedValueTypes: ['string', 'number'],
        },
        category: {
          id: 'category',
          acceptedValueTypes: ['string', 'number'],
        },
        description: {
          id: 'description',
          acceptedValueTypes: ['string', 'number'],
        },
        weight: {
          id: 'weight',
          acceptedValueTypes: ['number'],
        },
        id: {
          id: 'id',
          acceptedValueTypes: ['string', 'number'],
        },
        source: {
          id: 'source',
          acceptedValueTypes: ['string', 'number'],
        },
        target: {
          id: 'target',
          acceptedValueTypes: ['string', 'number'],
        }
      }
    },
    defaultViewParameters: {
      cameraX: 0,
      cameraY: 0,
      cameraRatio: 2,
      cameraAngle: 0,
      labelThreshold: 7,
      minNodeSize: 1,
      sideMargin: 0,
    },
    slideParameters: [
      {
        id: 'cameraX',
        default: 0
      },
      {
        id: 'cameraY',
        default: 0
      },
      {
        id: 'cameraAngle',
        default: 0
      },
      {
        id: 'cameraRatio',
        default: 1
      }
    ]
  }
};
export default models;

export function createDefaultSlideParameters(type) {
  const slideModel = models[type].defaultViewParameters;
  // populate slide data with default where needed
  return slideModel.reduce((output, parameterModel) => {
    output[parameterModel.id] = parameterModel.default;
    return output;
  }, {});
}

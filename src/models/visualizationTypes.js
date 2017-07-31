/**
 * This module exports the models related to visualization types (mappable values, parameters, default values, example files, ...)
 * @module bulgur/models/visualizationTypes
 */


/**
 * Visualization models
 * @type {object}
 */
const models = {
  timeline: {
    type: 'timeline',
    acceptedFileExtensions: ['csv'],
    dataMap: {
      main: {
        'title': {
          id: 'title',
          acceptedValueTypes: ['string', 'number']
        },
        'description': {
          id: 'description',
          acceptedValueTypes: ['string']
        },
        'source': {
          id: 'source',
          acceptedValueTypes: ['string']
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
      description: 'More information: http://www.datavis.ca/',
      recommendedVisTypes: ['timeline']
    }
    ],
    defaultViewParameters: {
      fromDate: new Date().setFullYear(1900),
      toDate: new Date().setFullYear(1960),
    }
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
    viewOptions: [
      {
        label: 'Map tiles',
        viewParameter: 'tilesUrl',
        optionType: 'select',
        options: [
          {
            value: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            id: 'positron',
            label: 'CartoDB - positron'
          },
          {
            value: 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
            id: 'cycle',
            label: 'OSM - Cycle'
          },
          {
            value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            id: 'mapnik',
            label: 'OSM - Mapnik'
          },
          {
            value: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png',
            id: 'terrain',
            label: 'Stamen - terrain'
          },
          {
            value: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
            id: 'toner',
            label: 'Stamen - toner'
          },
        ]
      }
    ],
    samples: [
      {
        title: 'Histoire du Fort et des combats de 1870-1871 à Issy',
        fileName: 'histoiredufort.csv',
        description: 'Plus d\'informations: http://data.issy.com/explore/dataset/histoiredufort-feuille1/export/?disjunctive.refqr',
        recommendedVisTypes: ['map', 'timeline']
      },
      {
        title: 'Places',
        fileName: 'places.csv',
        description: 'Some cities coordinates',
        recommendedVisTypes: ['map']
      }
    ],
    defaultViewParameters: {
      cameraX: 48.8674345,
      cameraY: 2.3455482,
      cameraZoom: 4,
      tilesUrl: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    },
  },
  network: {
    type: 'network',
    acceptedFileExtensions: ['gexf', 'json', 'graphml'],
    samples: [
      {
        title: 'Arctic',
        fileName: 'arctic.gexf',
        description: 'Taken from quinoa examples',
        recommendedVisTypes: ['network']
      },
      {
        title: 'Les misérables Co-Occurences',
        fileName: 'miserables.json',
        description: 'List of co-occurences of characters in the novel "les misérables", computed by Jacques Bertin and his assistants(https://bost.ocks.org/mike/miserables/)',
        recommendedVisTypes: ['network']
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
      cameraRatio: 5,
      cameraAngle: 0,
      labelThreshold: 7,
      minNodeSize: 1,
      sideMargin: 0,
    },
    viewOptions: [
      {
        label: 'Labels threshold',
        viewParameter: 'labelThreshold',
        optionType: 'slider',
        options: {
          defaultValue: 7,
          minimum: 1,
          maximum: 12
        }
      },
      {
        label: 'Minimum node sizes',
        viewParameter: 'minNodeSize',
        optionType: 'slider',
        options: {
          defaultValue: 1,
          minimum: 1,
          maximum: 20
        }
      }
    ],
  },
  svg: {
    type: 'svg',
    acceptedFileExtensions: ['svg'],
    dataMap: {
      main: {
      }
    },
    samples: [
      {
        title: 'SVG example',
        fileName: 'linkedin-network.svgm',
        description: 'A network svg file',
        recommendedVisTypes: ['svg']
      }
    ],
    defaultViewParameters: {
      maxZoomLevel: 1000,
      minZoomLevel: -2000,
      perspectiveLevel: 1000,
      x: 0,
      y: 0,
      zoomFactor: 50,
      zoomLevel: 1
    },
  },
};
export default models;


/**
 * Generates default slides parameters for a given visualization type
 * @param {string} type - visualization type
 * @return {object} visualizationParameters - default parameters for a specific visualization
 */
export function createDefaultSlideParameters(type) {
  const slideModel = models[type].defaultViewParameters;
  // populate slide data with default where needed
  return slideModel.reduce((output, parameterModel) => {
    output[parameterModel.id] = parameterModel.default;
    return output;
  }, {});
}

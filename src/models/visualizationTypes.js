
const models = {
  time: {
    acceptedFileExtensions: ['csv', 'tsv'],
    dataMap: [
      {
        id: 'content',
        acceptedValueTypes: ['string']
      },
      {
        id: 'year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'day',
        acceptedValueTypes: ['number']
      },
      {
        id: 'time',
        acceptedValueTypes: ['string']
      },
      {
        id: 'end year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'end month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'end day',
        acceptedValueTypes: ['number']
      },
      {
        id: 'end time',
        acceptedValueTypes: ['string']
      },
      /*{
        id: 'display date',
        acceptedValueTypes: ['string']
      },
      {
        id: 'headline',
        acceptedValueTypes: ['string']
      },
      {
        id: 'text',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media',
        acceptedValueTypes: ['url']
      },
      {
        id: 'media credit',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media caption',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media thumbnail',
        acceptedValueTypes: ['string']
      },
      {
        id: 'type',
        acceptedValueTypes: ['string']
      },*/
      {
        id: 'group',
        acceptedValueTypes: ['string']
      },
      /*{
        id: 'background',
        acceptedValueTypes: ['string']
      }*/
    ],
    samples: [
    {
      title: 'Milestones in the history of data visualization',
      fileName: 'milestones-history-datavis.csv',
      description: 'More information: http://www.datavis.ca/'
    }
    ],
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
  space: {
    acceptedFileExtensions: ['csv', 'tsv'],
    dataMap: [
      {
        id: 'latitude',
        acceptedValueTypes: ['number']
      },
      {
        id: 'longitude',
        acceptedValueTypes: ['number']
      },
      {
        id: 'title',
        acceptedValueTypes: ['string']
      },
      {
        id: 'group',
        acceptedValueTypes: ['string']
      },
      {
        id: 'description',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media',
        acceptedValueTypes: ['url']
      }
    ],
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
    ]
  },
  relations: {
    acceptedFileExtensions: ['gexf'],
    samples: [{
      title: 'Arctic',
      fileName: 'arctic.gexf',
      description: 'Taken from quinoa examples'
    }],
    dataMap: [
      {
        id: 'gexf',
        acceptedValueTypes: ['string']
      }
    ],
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
  const slideModel = models[type].slideParameters;
  // populate slide data with default where needed
  return slideModel.reduce((output, parameterModel) => {
    output[parameterModel.id] = parameterModel.default;
    return output;
  }, {});
}

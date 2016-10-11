
const models = {
  time: {
    acceptedFileExtensions: ['csv', 'tsv'],
    invariantParameters: [
      {
        id: 'year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'Day',
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
      {
        id: 'display Date',
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
        id: 'media Credit',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media Caption',
        acceptedValueTypes: ['string']
      },
      {
        id: 'media Thumbnail',
        acceptedValueTypes: ['string']
      },
      {
        id: 'type',
        acceptedValueTypes: ['string']
      },
      {
        id: 'group',
        acceptedValueTypes: ['string']
      },
      {
        id: 'background',
        acceptedValueTypes: ['string']
      }
    ],
    samples: [{
      title: 'Histoire du Fort et des combats de 1870-1871 à Issy',
      fileName: 'histoiredufort.csv',
      description: 'Plus d\'informations: http://data.issy.com/explore/dataset/histoiredufort-feuille1/export/?disjunctive.refqr'
    },
    {
      title: 'Dataset officiel de timelinejs',
      fileName: 'official-timeline-js.csv',
      description: 'Plus d\'informations: http://timeline.knightlab.com/'
    }]
  },
  space: {
    acceptedFileExtensions: ['csv', 'tsv'],
    invariantParameters: [
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
    samples: [{
      title: 'Histoire du Fort et des combats de 1870-1871 à Issy',
      fileName: 'histoiredufort.csv',
      description: 'Plus d\'informations: http://data.issy.com/explore/dataset/histoiredufort-feuille1/export/?disjunctive.refqr'
    }]
  },
  relations: {
    acceptedFileExtensions: ['gefx'],
    samples: [{
      title: 'Arctic',
      fileName: 'arctic.gefx',
      description: 'Taken from quinoa examples'
    }],
    invariantParameters: [
      {
        id: 'test',
        acceptedValueTypes: ['string']
      }
    ]
  },
};
export default models;

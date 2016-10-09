
const models = {
  time: {
    acceptedFileExtensions: ['csv'],
    invariantParameters: [
      {
        id: 'Year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'Month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'Day',
        acceptedValueTypes: ['number']
      },
      {
        id: 'Time',
        acceptedValueTypes: ['string']
      },
      {
        id: 'End Year',
        acceptedValueTypes: ['number']
      },
      {
        id: 'End Month',
        acceptedValueTypes: ['number']
      },
      {
        id: 'End Day',
        acceptedValueTypes: ['number']
      },
      {
        id: 'End Time',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Display Date',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Headline',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Text',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Media',
        acceptedValueTypes: ['url']
      },
      {
        id: 'Media Credit',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Media Caption',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Media Thumbnail',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Type',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Group',
        acceptedValueTypes: ['string']
      },
      {
        id: 'Background',
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
};
export default models;

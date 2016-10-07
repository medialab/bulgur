
const models = {
  time: {
    acceptedFileExtensions: ['csv'],
    invariantParameters: [
      {
        id: 'eventsDates',
        label: 'events dates',
        acceptedValueTypes: ['date']
      },
      {
        id: 'eventsLabels',
        label: 'events labels',
        acceptedValueTypes: ['string']
      },
      {
        id: 'eventsTexts',
        label: 'events texts',
        acceptedValueTypes: ['string']
      },
      {
        id: 'eventsUrls',
        label: 'events urls',
        acceptedValueTypes: ['url']
      },
      {
        id: 'eventCategories',
        label: 'events categories',
        acceptedValueTypes: ['string']
      }
    ],
    samples: [{
      title: 'Histoire du Fort et des combats de 1870-1871 à Issy',
      fileName: 'histoiredufort.csv',
      description: 'Plus d\'informations: http://data.issy.com/explore/dataset/histoiredufort-feuille1/export/?disjunctive.refqr'
    }]
  },
};
export default models;

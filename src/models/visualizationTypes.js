
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
    samples : [{
      title: 'My sample temporal data',
      fileName: 'My sample temporal file',
      description: 'A sample file for working with temporal data'
    }]
  },
};
export default models;
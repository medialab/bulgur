
const bulgurProjectModel = {
  type: 'object',
  contains: {
    data: {
      type: 'array'
    },
    globalParameters: {
      type: 'object',
      contains: {
        visualizationType: {
          type: 'string'
        }
      }
    },
    story: {
      type: 'object',
      contains: {
        order: {
          type: 'array'
        },
        slides: {
          type: 'object'
        }
      }
    }
  }
};

export default bulgurProjectModel;

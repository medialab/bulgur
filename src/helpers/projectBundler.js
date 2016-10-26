
export default function bundleProject (visualizationData, quinoaStory) {
  return {
      data: visualizationData.data,
      globalParameters: {
        parameters: visualizationData.parameters,
        visualizationType: visualizationData.visualizationType
      },
      story: {
        order: quinoaStory.order.slice(),
        slides: Object.keys(quinoaStory.slides).map(slideKey => {
          const slide = quinoaStory.slides[slideKey];
          return {
            id: slide.id,
            markdown: slide.markdown,
            title: slide.title,
            meta: Object.assign({}, slide.meta)
          };
        }).reduce((sl, slide) => {
          sl[slide.id] = slide;
          return sl;
        }, {})
      }
  };
}
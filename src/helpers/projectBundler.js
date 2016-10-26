
export function bundleProjectAsJson (visualizationData, quinoaStory) {
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

export function bundleProjectAsHtml (jsonBundle) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bulgur</title>
  <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
  <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Abhaya+Libre" rel="stylesheet">
  <meta charset="utf-8">
</head>
<body>
  <div id="mount"></div>

  <!-- Project data -->
  <script type="text/javascript">
  window.__project__ = ${JSON.stringify(jsonBundle)}
  </script>

  <!-- Loading Sigma Dependencies -->
  <script type="text/javascript" src="https://rawgit.com/medialab/bulgur/master/external/sigma.min.js"></script>
  <script type="text/javascript" src="https://rawgit.com/medialab/bulgur/master/external/sigma.parsers.gexf.min.js"></script>
  <script type="text/javascript" src="https://rawgit.com/medialab/bulgur/master/external/sigma.layout.forceAtlas2.min.js"></script>
  <script type="text/javascript" src="https://rawgit.com/medialab/bulgur/master/external/sigma.plugins.saveCamera.js"></script>

  <!-- App code -->
  <script type="text/javascript" src="https://rawgit.com/medialab/bulgur/master/build/bundle.js">
  </script>

</body>
</html>
`;
}

/*
<!-- Loading Sigma Dependencies -->
  <script type="text/javascript">${sigmaMain}</script>
  <script type="text/javascript">${sigmaGexf}</script>
  <script type="text/javascript">${sigmaForceAtlas2}</script>
  <script type="text/javascript">${sigmaSaveCamera}</script>

  <!-- App code -->
  <script type="text/javascript">${bundle}</script>
*/
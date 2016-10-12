import React from 'react';

import './Map.scss';

const Map = ({
  data = [],
  dataMap = [],
  slideParameters = {}
}) => {
  return (
    <div>
      <h2>Map visualization</h2>
      <p>Slide Parameters</p>
      {JSON.stringify(slideParameters, null, 2)}
      <p>Data fields / visualization parameters mapping:</p>
      <ul>
        {dataMap.map((parameter, key) =>
          (<li key={key}>{parameter.id} : {parameter.mappedField}</li>)
        )}
      </ul>
      <pre>
        Data: {JSON.stringify(data, null, 1)}
      </pre>
    </div>
  );
};

export default Map;


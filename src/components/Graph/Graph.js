import React from 'react';

import './Graph.scss';

const Graph = ({
  data = [],
  dataMap = [],
  slideParameters = {}
}) => {
  return (
    <div>
      <h2>Graph visualization</h2>
      <p>Data fields / visualization parameters mapping:</p>
      <p>Slide Parameters</p>
      {JSON.stringify(slideParameters, null, 2)}
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

export default Graph;


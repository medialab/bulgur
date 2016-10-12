import React from 'react';

import './Graph.scss';

const Graph = ({
  data = [],
  invariantParameters = [],
  slideParameters = {}
}) => {
  return (
    <div>
      <h2>Graph visualization</h2>
      <p>Invariant parameters:</p>
      <p>Slide Parameters</p>
      {JSON.stringify(slideParameters, null, 2)}
      <ul>
        {invariantParameters.map((parameter, key) =>
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


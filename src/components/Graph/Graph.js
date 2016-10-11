import React from 'react';

import './Graph.scss';

const Graph = ({
  data = [],
  invariantParameters = []
}) => {
  return (
    <div>
      <h2>Graph visualization</h2>
      <p>Invariant parameters:</p>
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


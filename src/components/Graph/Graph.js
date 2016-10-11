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
        {data}
      </pre>
    </div>
  );
};

export default Graph;


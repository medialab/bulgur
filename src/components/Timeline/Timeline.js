import React from 'react';

import './Timeline.scss';

const Timeline = ({
  data = [],
  invariantParameters = [],
  slideParameters = {}
}) => {
  return (
    <div>
      <h2>Timeline visualization</h2>
      <p>Slide Parameters</p>
      {JSON.stringify(slideParameters, null, 2)}
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

export default Timeline;


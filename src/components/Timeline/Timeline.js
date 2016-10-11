import React from 'react';

import './Timeline.scss';

const Timeline = ({
  data = [],
  invariantParameters = []
}) => {
  return (
    <div>
      <h2>Timeline visualization</h2>
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

export default Timeline;


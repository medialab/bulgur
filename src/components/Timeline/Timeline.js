import React from 'react';

import './Timeline.scss';

const Timeline = ({
  data = [],
  dataMap = [],
  slideParameters = {}
}) => {
  return (
    <div>
      <h2>Timeline visualization</h2>
      <p>Slide Parameters</p>
      {JSON.stringify(slideParameters, null, 2)}
      <p>IData fields / visualization parameters mapping:</p>
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

export default Timeline;


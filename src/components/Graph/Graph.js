import React from 'react';

import './Graph.scss';

const Graph = ({
  data = [],
  dataMap = [],
  viewParameters = {},
  updateView
}) => {
  return (
    <div>
      <h2>Graph visualization</h2>
      <p>Data fields / visualization parameters mapping:</p>
      <p>Slide Parameters</p>
      {Object.keys(viewParameters).map((parameterKey, key) => {
        const onInputChange = (evt) => {
          updateView({
            ...viewParameters,
            [parameterKey]: evt.target.value
          });
        };
        return (
          <div key={key}>
            <p>{parameterKey}</p>
            <form>
              <input
                style={{background: 'red'}}
                value={viewParameters[parameterKey]}
                onChange={onInputChange} />
            </form>
          </div>
        );
      })}
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


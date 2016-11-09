import React from 'react';
import {default as TimelineComponent} from 'react-visjs-timeline';
import './Timeline.scss';

const Timeline = ({
  data = [],
  viewParameters = {},
  updateView
}) => {
  const range = {
    start: viewParameters && new Date(viewParameters.fromDate),
    end: viewParameters && new Date(viewParameters.toDate)
  };

  const animation = {
    duration: 100,
    easingFunction: 'easeInQuint'
  };

  const options = {
    width: '100%',
    height: '100%',
    stack: true,
    showMajorLabels: true,
    showCurrentTime: false,

    type: 'point',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    },
    start: range.start,
    end: range.end
  };

  function onRange(props) {
    if (props.byUser) {
      const params = {fromDate: props.start.getTime(), toDate: props.end.getTime()};
      updateView(params);
    }
  }

  return (
    <TimelineComponent
      options={options}
      rangechangedHandler={onRange}
      items={data}
      animation={animation}
     />
  );
};

export default Timeline;


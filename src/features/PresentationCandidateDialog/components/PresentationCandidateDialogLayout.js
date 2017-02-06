import React from 'react';

import {validateFileExtension} from '../../../helpers/fileLoader';

import Dropzone from 'react-dropzone';

import ColorsMapPicker from '../../../components/ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../../../components/DatamapPicker/DatamapPicker';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData,
  Timeline,
  Map,
  Network
} from 'quinoa-vis-modules';

import './PresentationCandidateDialog.scss';

const previewVisualization = (visualization, models) => {
  let data = {};
  const viewParameters = {
    ...models[visualization.metadata.visualizationType].defaultViewParameters,
    colorsMap: visualization.colorsMap
  };
  // flatten datamap fields (todo: refactor as helper)
  const dataMap = Object.keys(visualization.dataMap).reduce((result, collectionId) => ({
    ...result,
    [collectionId]: Object.keys(visualization.dataMap[collectionId]).reduce((propsMap, parameterId) => {
      const parameter = visualization.dataMap[collectionId][parameterId];
      if (parameter.mappedField) {
        return {
          ...propsMap,
          [parameterId]: parameter.mappedField
        };
      }
      return propsMap;
    }, {})
  }), {});

  // todo : ooooh this is bad
  try {
    switch (visualization.metadata.visualizationType) {
      case 'timeline':
        data = mapTimelineData(visualization.data, dataMap);
        return (<Timeline
          data={data}
          allowUserViewChange
          viewParameters={viewParameters} />);
      case 'map':
        data = mapMapData(visualization.data, dataMap);
        return (<Map
          data={data}
          allowUserViewChange
          viewParameters={viewParameters} />);
      case 'network':
        data = mapNetworkData(visualization.data, dataMap);
        return (<Network
          data={data}
          allowUserViewChange
          viewParameters={viewParameters} />);
      default:
        return (<div>No preview</div>);
    }
  }
 catch (e) {
    return (<div>Cannot provide a preview yet</div>);
  }
};

const PresentationCandidateDialogLayout = ({
  presentationCandidate = {
    visualizations: {},
    datasets: {}
  },
  activeVisualizationType,
  activeVisualizationTypes = [],
  visualizationTypesModels,
  actions: {
    fetchExampleFile,
    fetchUserFile,
    setCandidatePresentationMetadata,
    setCandidatePresentationDatasetMetadata,
    unsetPresentationCandidateDataset,
    setPresentationCandidateVisualizationType,
    setPresentationCandidateDatamapItem,
    toggleCandidateColorEdition,
    setPresentationCandidateColor,
    applyPresentationCandidateConfiguration
  },
  closePresentationCandidate,
  onFileDrop,

  editedColor
}) => {
  const onApplyChange = () => applyPresentationCandidateConfiguration(presentationCandidate);
  const onDropInput = (files) => onFileDrop(files[0]);
  const setPresentationTitle = (e) => setCandidatePresentationMetadata('title', e.target.value);
  const setPresentationAuthors = (e) => setCandidatePresentationMetadata('authors', e.target.value);
  const setPresentationDescription = (e) => setCandidatePresentationMetadata('description', e.target.value);
  return (
    <div className="bulgur-presentation-candidate-dialog">
      <section className="options-group">
        <h2>What is your presentation about ?</h2>
        <form>
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input
              onChange={setPresentationTitle}
              type="text"
              name="title"
              value={presentationCandidate.metadata.title} />
          </div>

          <div className="input-group">
            <label htmlFor="authors">Authors</label>
            <input
              onChange={setPresentationAuthors}
              type="text"
              name="authors"
              value={presentationCandidate.metadata.authors} />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              onChange={setPresentationDescription}
              type="text"
              name="description"
              value={presentationCandidate.metadata.description} />
          </div>
        </form>
      </section>

      <section className="options-group">
        <h2>What data do you want to use ?</h2>

        { // future-proof code for possible multi-datasets visualizations
        presentationCandidate.datasets &&
        Object.keys(presentationCandidate.datasets).length > 0 ?
          <section className="second-options-group">
            {Object.keys(presentationCandidate.datasets)
            .map(datasetId => {
              const dataset = presentationCandidate.datasets[datasetId];
              const onRemoveDataset = () => unsetPresentationCandidateDataset(datasetId);
              const onDropNewData = (files) => {
                fetchUserFile(files[0], datasetId, true);
              };
              const setTitle = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'title', e.target.value);
              const setDescription = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'description', e.target.value);
              const setUrl = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'url', e.target.value);
              const setLicense = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'license', e.target.value);
              return (
                <div key={datasetId} className="dataset-card">
                  <h4>Dataset settings</h4>
                  <div className="dataset-settings">
                    <form>
                      <p>Original file name : {dataset.metadata.fileName}</p>
                      <p>Original file format : {dataset.metadata.format}</p>
                      <div className="input-group">
                        <label htmlFor="title">Title</label>
                        <input
                          onChange={setTitle}
                          type="text"
                          name="title"
                          value={dataset.metadata.title} />
                      </div>
                      <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          onChange={setDescription}
                          type="text"
                          name="description"
                          value={dataset.metadata.description} />
                      </div>
                      <div className="input-group">
                        <label htmlFor="url">Url</label>
                        <input
                          onChange={setUrl}
                          type="text"
                          name="url"
                          value={dataset.metadata.url} />
                      </div>
                      <div className="input-group">
                        <label htmlFor="license">License</label>
                        <input
                          onChange={setLicense}
                          type="text"
                          name="license"
                          value={dataset.metadata.license} />
                      </div>
                    </form>

                    <div className="dataset-management">
                      <Dropzone
                        className="drop-zone"
                        activeClassName="drop-zone-active"
                        onDrop={onDropNewData}>
                        <div>Reupload new data for this dataset</div>
                      </Dropzone>
                      {
                      // todo : uncomment this when multi datasets use cases arise (dataset deletion feature)
                        <button className="remove-dataset" onClick={onRemoveDataset}>Remove this dataset</button>
                  }
                    </div>
                  </div>
                </div>
            );
          })}
          </section>
        :
          <section className="second-options-group">
            <section className="data-source-choice">
              <section className="data-source-file">
                <h4>A file from my computer</h4>
                <Dropzone
                  className="drop-zone"
                  activeClassName="drop-zone-active"
                  onDrop={onDropInput}>
                  <div>Drop a file here</div>
                </Dropzone>
              </section>
              <section className="data-source-examples">
                <h4>A sample file</h4>
                {Object.keys(visualizationTypesModels)
                .map(modelType => visualizationTypesModels[modelType])
                .map(model => model.samples.map((sample, key) => {
                  const fetchFile = () => {
                    fetchExampleFile(sample);
                  };
                  return (
                    <div key={key} onClick={fetchFile} className="sample-file">
                      <h3>{sample.title} ({model.type})</h3>
                      <p>{sample.description}</p>
                    </div>
                  );
                }))
              }
              </section>
            </section>
          </section>
      }
      </section>
      <section className="options-group">
        <h2>How to visualize the data ?</h2>
        {
        presentationCandidate.visualizations &&
        Object.keys(presentationCandidate.visualizations)
        .map(visualizationKey => {
          const visualization = presentationCandidate.visualizations[visualizationKey];
          return (
            <section key={visualizationKey}>
              <form className="visualization-type-choice">
                {activeVisualizationTypes.map((type, key) => {
                    const visType = type.id;
                    const firstDataset = presentationCandidate.datasets[Object.keys(presentationCandidate.datasets)[0]];
                    const datasetFileName = firstDataset && firstDataset.metadata.fileName;
                    const valid = validateFileExtension(datasetFileName, visualizationTypesModels[type.id]);
                    const active = visualization.metadata && visualization.metadata.visualizationType === visType;
                    const switchType = () => valid && !active && setPresentationCandidateVisualizationType(visualizationKey, visType);
                    return (<div className={'visualization-type-item' + (valid ? ' valid' : '') + (active ? ' active' : '')}
                      id={activeVisualizationType === visType ? 'visualization-type-checked' : ''}
                      onClick={switchType}
                      key={key}>
                      <input
                        type="radio"
                        id={visType}
                        name={visType}
                        value="type"
                        onChange={switchType}
                        checked={activeVisualizationType === visType} />
                      <label
                        htmlFor={visType}>
                        <img className="bulgur-icon-image" src={require('../assets/bulgur-vistype-' + visType + '.svg')} />
                        <h3>{type.name}</h3>
                      </label>
                    </div>);
                })}
              </form>
              {visualization.metadata && visualization.metadata.visualizationType && visualization.dataMap ?
                <section className="data-fields-choice">
                  <ul className="parameters-endpoints">
                    {
                      Object.keys(visualization.dataMap)
                      .map(collectionId => {
                        const collectionMap = visualization.dataMap[collectionId];
                        return (
                          <div className="datamap-group" key={collectionId}>
                            {Object.keys(visualization.dataMap).length > 1 ? <h3>{collectionId}</h3> : null}
                            <div className="datamap-group-mosaic">
                              {
                              Object.keys(collectionMap)
                              .map(parameterKey => {
                                return (
                                  <DatamapPicker
                                    key={parameterKey}
                                    parameterKey={parameterKey}
                                    parameter={collectionMap[parameterKey]}
                                    visualization={visualization}
                                    visualizationKey={visualizationKey}
                                    collectionId={collectionId}
                                    onMappingChange={setPresentationCandidateDatamapItem} />
                                );
                              })
                            }
                            </div>
                          </div>
                        );
                      })
                      }
                  </ul>
                </section> : null}
              <h2>How to color your categories ?</h2>

              <section className="final-touch-container">
                {// colors edition
                visualization.colorsMap ?
                  <ColorsMapPicker
                    colorsMap={visualization.colorsMap}
                    visualizationKey={visualizationKey}
                    editedColor={editedColor}
                    changeColor={setPresentationCandidateColor}
                    toggleColorEdition={toggleCandidateColorEdition} />
               : null}
                {// preview
                visualization.colorsMap &&
                visualization.dataProfile &&
                visualization.data &&
                visualization.dataMap ?
                  <section className="preview">
                    {previewVisualization(visualization, visualizationTypesModels)}
                  </section>
                : null}
              </section>
            </section>
          );
        })
      }
      </section>
      <section className="options-group presentation-candidate-dialog-step final-step">
        {
          presentationCandidate &&
          presentationCandidate.visualizations &&
          typeof presentationCandidate.visualizations === 'object' &&
          Object.keys(presentationCandidate.visualizations).length > 0 &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].colorsMap &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].dataProfile &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].data &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].dataMap
        ?
          <button
            className="valid-btn"
            onClick={onApplyChange}>Edit the presentation content</button>
        : ''
      }
        <button
          className="cancel-btn"
          onClick={closePresentationCandidate}>
        Cancel
      </button>
      </section>
    </div>
);
};

export default PresentationCandidateDialogLayout;

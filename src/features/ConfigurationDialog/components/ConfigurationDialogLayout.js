/**
 * This module exports a stateless component rendering the layout of the configuration dialog feature interface
 * @module bulgur/features/ConfigurationDialog
 */
import React from 'react';

import {validateFileExtension} from '../../../helpers/fileLoader';

import Dropzone from 'react-dropzone';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import ColorsMapPicker from '../../../components/ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../../../components/DatamapPicker/DatamapPicker';

import './ConfigurationDialog.scss';

/**
 * Renders a preview of the given visualization
 * @param {object} props - the props to render
 * @param {object} props.visualization - the definition of the visualization to preview
 * @param {object} props.models - the models to use in order to populate default view parameters
 * @param {function} props.updateParameters - the callback function to use for updating the state
 * @param {string} props.visualizationId - the id of the visualization to preview
 * @return {ReactElement} markup
 */
const previewVisualization = (visualization, models, updateParameters, visualizationId) => {
  const baseViewParameters = visualization.viewParameters || models[visualization.metadata.visualizationType].defaultViewParameters;
  const viewParameters = {
    ...baseViewParameters,
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
  const onChange = e => updateParameters(visualizationId, e.viewParameters);
  return (
    <VisualizationManager
      visualizationType={visualization.metadata.visualizationType}
      data={visualization.data}
      dataMap={dataMap}
      viewParameters={viewParameters}
      onUserChange={onChange} />
    );
};

/**
 * Renders the configuration dialog layout
 * @param {object} props - the props to render
 * @param {object} props.presentationCandidate - the data of the presentation to configure
 * @param {string} props.fetchUserFileStatus - the status of the file the user is trying to upload
 * @param {object} props.activeVisualizationTypes - models to display available visualization types
 * @param {object} props.activeVisualizationTypesModels - models to use for displaying visualization type related configurations
 * @param {object} props.actions - actions from the redux logic
 * @param {function} props.closePresentationCandidate - function to trigger for closing the presentation
 * @param {function} props.onFileDrop - callback function to be handled by container
 * @param {object} props.editedColor - current edited color (allows just once at a time)
 * @return {ReactElement} markup
 */
const ConfigurationDialogLayout = ({
  presentationCandidate = {
    visualizations: {},
    datasets: {}
  },
  fetchUserFileStatus,
  // todo : delete the following variable and do everything with visualizationTypesModels
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
    applyPresentationCandidateConfiguration,
    setPreviewViewParameters
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
  const hasSlides = presentationCandidate.order && presentationCandidate.order.length;
  return (
    <div className="bulgur-configuration-dialog-layout">
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

        <p className="help-link-container">
          <a className="help-link" target="blank" href="https://github.com/medialab/bulgur/wiki/What-data-formats-and--tools-can-I-use-to-build-a-presentation-dataset-%3F">What data formats and tools can I use to build a presentation dataset ?</a>
        </p>
        {
        // future-proof code for possible multi-datasets visualizations
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
                        // disabled if slides are present to avoid allowing bugs related to vis states without the required dataset
                        !hasSlides ?
                          <button className="remove-dataset" onClick={onRemoveDataset}>Remove this dataset</button>
                        : null
                      }
                    </div>
                    <div className="dataset-preview">
                      <h5>Raw data being used (first 20 lines)</h5>
                      <pre>
                        <code>
                          {dataset.rawData.split('\n').slice(0, 20).join('\n')}
                        </code>
                      </pre>
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
        {
          fetchUserFileStatus ?
            <div style={{background: 'red', color: 'white'}}>{fetchUserFileStatus}</div>
          : null
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
              {hasSlides ? null : <form className="visualization-type-choice">
                {activeVisualizationTypes.map((type, key) => {
                    const visType = type.id;
                    const firstDataset = presentationCandidate.datasets[Object.keys(presentationCandidate.datasets)[0]];
                    const datasetFileName = firstDataset && firstDataset.metadata.fileName;
                    const valid = validateFileExtension(datasetFileName, visualizationTypesModels[type.id]);
                    const active = visualization.metadata && visualization.metadata.visualizationType === visType;
                    const switchType = () => valid && !active && setPresentationCandidateVisualizationType(visualizationKey, visType);
                    const activeVisType = visualization.metadata && visualization.metadata.visualizationType;
                    return (<div className={'visualization-type-item' + (valid ? ' valid' : '') + (active ? ' active' : '')}
                      id={activeVisType === visType ? 'visualization-type-checked' : ''}
                      onClick={switchType}
                      key={key}>
                      <input
                        type="radio"
                        id={visType}
                        name={visType}
                        value="type"
                        onChange={switchType}
                        checked={activeVisType === visType} />
                      <label
                        htmlFor={visType}>
                        <img className="bulgur-icon-image" src={require('../assets/bulgur-vistype-' + visType + '.svg')} />
                        <h3>{type.name}</h3>
                      </label>
                    </div>);
                })}
              </form>}
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
                    visualizationId={visualizationKey}
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
                    {previewVisualization(visualization, visualizationTypesModels, setPreviewViewParameters, visualizationKey)}
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
            onClick={onApplyChange}>{hasSlides ? 'Apply changes and continue presentation edition' : 'Start to edit this presentation'}</button>
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

export default ConfigurationDialogLayout;

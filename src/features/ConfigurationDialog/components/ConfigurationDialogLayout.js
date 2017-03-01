/**
 * This module exports a stateless component rendering the layout of the configuration dialog feature interface
 * @module bulgur/features/ConfigurationDialog
 */
import React from 'react';

import {validateFileExtensionForVisType} from '../../../helpers/fileLoader';

import Textarea from 'react-textarea-autosize';

import VisualizationManager from '../../../components/VisualizationManager/VisualizationManager';
import ColorsMapPicker from '../../../components/ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../../../components/DatamapPicker/DatamapPicker';
import DropZone from '../../../components/DropZone/DropZone';
import BigSelect from '../../../components/BigSelect/BigSelect';
import HelpPin from '../../../components/HelpPin/HelpPin';
import ViewOptionPicker from '../../../components/ViewOptionPicker/ViewOptionPicker';

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
 * @param {string} props.dataSourceTab - ui state for the source of data set by the user
 * @param {object} props.activeVisualizationTypes - models to display available visualization types
 * @param {object} props.activeVisualizationTypesModels - models to use for displaying visualization type related configurations
 * @param {object} props.actions - actions from the redux logic
 * @param {function} props.closePresentationCandidate - function to trigger for closing the presentation
 * @param {function} props.onFileDrop - callback function to be handled by container
 * @param {function} props.validateFileExtension - util to validate globally a file extension
 * @param {object} props.editedColor - current edited color (allows just once at a time)
 * @return {ReactElement} markup
 */
const ConfigurationDialogLayout = ({
  presentationCandidate = {
    visualizations: {},
    datasets: {}
  },
  fetchUserFileStatus,
  dataSourceTab,
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
    setPresentationCandidateViewOption,
    setPreviewViewParameters,
    setDataSourceTab
  },
  closePresentationCandidate,
  onFileDrop,
  validateFileExtension,
  editedColor
}) => {
  const onApplyChange = () => applyPresentationCandidateConfiguration(presentationCandidate);
  const onDropInput = (files) => onFileDrop(files[0]);
  const setPresentationTitle = (e) => setCandidatePresentationMetadata('title', e.target.value);
  const setPresentationAuthors = (e) => setCandidatePresentationMetadata('authors', e.target.value);
  const setPresentationDescription = (e) => setCandidatePresentationMetadata('description', e.target.value);
  const setDataSourceComputer = () => setDataSourceTab('computer');
  const setDataSourceSample = () => setDataSourceTab('sample');
  const hasSlides = presentationCandidate.order && presentationCandidate.order.length;

  return (
    <div className="bulgur-configuration-dialog-layout">
      <h1 className="modal-header">
        Presentation configuration
      </h1>
      <section className="modal-content">
        <section className="modal-row">
          <h2>What is your presentation about ? <HelpPin>
              These informations will be very useful for building high-quality metadata for your presentation outputs
            </HelpPin></h2>
          <form className="modal-columns-container">
            <div className="modal-column">
              <div className="input-group">
                <label htmlFor="title">Title of the presentation</label>
                <input
                  onChange={setPresentationTitle}
                  type="text"
                  name="title"
                  placeholder="title of the presentation"
                  value={presentationCandidate.metadata.title} />
              </div>

              <div className="input-group">
                <label htmlFor="authors">Authors of the presentation</label>
                <input
                  onChange={setPresentationAuthors}
                  type="text"
                  name="authors"
                  placeholder="authors of the presentation"
                  value={presentationCandidate.metadata.authors} />
              </div>
            </div>

            <div className="modal-column">
              <div className="input-group" style={{flex: 1}}>
                <label htmlFor="description">Description of the presentation</label>
                <Textarea
                  onChange={setPresentationDescription}
                  type="text"
                  name="description"
                  placeholder="description of the presentation"
                  style={{flex: 1}}
                  value={presentationCandidate.metadata.description} />
              </div>
            </div>
          </form>
        </section>

        <section className="modal-row">
          <h2>
            What data do you want to use ? <HelpPin>
              <a className="help-link" target="blank" href="https://github.com/medialab/bulgur/wiki/What-data-formats-and--tools-can-I-use-to-build-a-presentation-dataset-%3F">What data formats and tools can I use to build a presentation dataset ?</a>
            </HelpPin>
          </h2>

          {/*<p className="help-link-container">
            <a className="help-link" target="blank" href="https://github.com/medialab/bulgur/wiki/What-data-formats-and--tools-can-I-use-to-build-a-presentation-dataset-%3F">What data formats and tools can I use to build a presentation dataset ?</a>
          </p>*/}
          {
          // future-proof code for possible multi-datasets visualizations
          presentationCandidate.datasets &&
          Object.keys(presentationCandidate.datasets).length > 0 ?
            <section className="dataset-wrapper">
              {Object.keys(presentationCandidate.datasets)
              .map(datasetId => {
                const dataset = presentationCandidate.datasets[datasetId];
                const onRemoveDataset = () => unsetPresentationCandidateDataset(datasetId);
                const onDropNewData = (files) => {
                  if (validateFileExtension(files[0])) {
                    fetchUserFile(files[0], datasetId, true);
                  }
                };
                const setTitle = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'title', e.target.value);
                const setDescription = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'description', e.target.value);
                const setUrl = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'url', e.target.value);
                const setLicense = (e) => setCandidatePresentationDatasetMetadata(datasetId, 'license', e.target.value);
                return (
                  <div key={datasetId} className="modal-columns-container">
                    <div className="modal-column">
                      <h4>Dataset metadata</h4>
                      <div className="dataset-settings">
                        <form>
                          <div className="input-group">
                            <label htmlFor="title">Title of the dataset</label>
                            <input
                              onChange={setTitle}
                              type="text"
                              name="title"
                              placeholder="title of the dataset"
                              value={dataset.metadata.title} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="description">Description of the dataset</label>
                            <Textarea
                              onChange={setDescription}
                              type="text"
                              name="description"
                              placeholder="description of the dataset"
                              value={dataset.metadata.description} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="url">Url of the dataset</label>
                            <input
                              onChange={setUrl}
                              type="text"
                              name="url"
                              placeholder="url of the dataset"
                              value={dataset.metadata.url} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="license">License of the dataset</label>
                            <input
                              onChange={setLicense}
                              type="text"
                              name="license"
                              placeholder="license of the dataset"
                              value={dataset.metadata.license} />
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="modal-column dataset-data">
                      <h4>Dataset data</h4>
                      <DropZone
                        onDrop={onDropNewData}>
                        <div>
                          <p>The file that was used for the current data is <code>{dataset.metadata.fileName}</code>.</p>
                          <p>Drop a file here to update this dataset with a new data file.</p>
                        </div>
                      </DropZone>
                      {
                        // disabled if slides are present to avoid allowing bugs related to vis states without the required dataset
                        !hasSlides ?
                          <button className="remove-dataset" onClick={onRemoveDataset}>Remove this dataset</button>
                        : null
                      }
                    </div>
                    <div className="modal-column dataset-preview">
                      <h4>Dataset preview (20 first lines)</h4>
                      <pre>
                        <code>
                          {dataset.rawData.split('\n').slice(0, 20).join('\n')}
                        </code>
                      </pre>
                    </div>
                  </div>
              );
            })}
            </section>
          :
            <section className="second-options-group">
              <ul className="data-source-type-toggler">
                <li onClick={setDataSourceComputer} className={dataSourceTab === 'computer' ? 'active' : ''}>
                    A file from my computer
                  </li>
                <li onClick={setDataSourceSample} className={dataSourceTab === 'sample' ? 'active' : ''}>
                    A sample file
                  </li>
              </ul>
              <section className="data-source-choice">
                {dataSourceTab === 'computer' ?
                  <section className="data-source">
                    <DropZone
                      onDrop={onDropInput}>
                      <div>Drop a file here</div>
                    </DropZone>
                  </section>
                :
                  <section className="data-source sample-files-container">
                    {Object.keys(visualizationTypesModels)
                  .map(modelType => visualizationTypesModels[modelType])
                  .map(model => model.samples.map((sample, key) => {
                    const fetchFile = () => {
                      fetchExampleFile(sample);
                    };
                    return (
                      <div key={key} className="sample-file">
                        <div onClick={fetchFile} className="sample-file-content">
                          <div>
                            <p className="pre-title"><i>Sample dataset</i></p>
                            <h3>{sample.title}</h3>
                          </div>
                          <div>
                            <p>{sample.description}</p>
                            <p className="recommended-vis-types">
                              <b>Recommended for: <i>{sample.recommendedVisTypes.map(type => type).join(', ')}</i>.</b>
                            </p>
                          </div>
                          <p>
                            <i>Select to use this dataset</i>
                          </p>
                        </div>
                      </div>
                    );
                  }))
                }
                  </section>}
              </section>
            </section>
        }
          {
            fetchUserFileStatus ?
              <div style={{background: 'red', color: 'white'}}>{fetchUserFileStatus}</div>
            : null
          }
        </section>
        {presentationCandidate && presentationCandidate.datasets && Object.keys(presentationCandidate.datasets).length > 0 ?
          <section className="modal-row">
            <h2>How to visualize the data ? <HelpPin>
              Sometimes the same dataset can be visualized with different techniques. Think about the point you are trying to make for choosing the right one !
            </HelpPin></h2>
            {

          presentationCandidate.visualizations &&
          Object.keys(presentationCandidate.visualizations)
          .map(visualizationKey => {
            const firstDataset = presentationCandidate.datasets[Object.keys(presentationCandidate.datasets)[0]];
            const datasetFileName = firstDataset && firstDataset.metadata.fileName;
            const visualization = presentationCandidate.visualizations[visualizationKey];
            const activeVisId = visualization.metadata && visualization.metadata.visualizationType;
            const switchType = (type) => {
              const id = type.id;
              const active = activeVisId === id;
              const valid = validateFileExtension(datasetFileName, visualizationTypesModels[id]);
              return valid && !active && setPresentationCandidateVisualizationType(visualizationKey, id);
            };
            const activeVisTypes = activeVisualizationTypes.map(type => ({
              ...type,
              label: type.id,
              icon: require('../assets/bulgur-vistype-' + type.id + '.svg'),
              possible: validateFileExtensionForVisType(datasetFileName, visualizationTypesModels[type.id])
            }));
            return (
              <section key={visualizationKey}>
                {hasSlides ? null :
                <BigSelect
                  options={activeVisTypes}
                  onOptionSelect={switchType}
                  activeOptionId={activeVisId} />
                }
                {visualization.metadata && visualization.metadata.visualizationType ?
                  <section className="modal-columns-container">
                    <section className="modal-column">
                      <h4>How to map your data to the visualization ?</h4>
                      {visualization.metadata && visualization.metadata.visualizationType && visualization.dataMap ?
                        <ul className="parameters-endpoints">
                          {
                            Object.keys(visualization.dataMap)
                            .map(collectionId => {
                              const collectionMap = visualization.dataMap[collectionId];
                              return (
                                <div className="datamap-group" key={collectionId}>
                                  {Object.keys(visualization.dataMap).length > 1 ?
                                    <h3>{collectionId.charAt(0).toUpperCase() + collectionId.slice(1) + ' mapping parameters'}</h3>
                                  : null}
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
                       : null}
                      {visualization.viewOptions &&
                       visualization.viewOptions.length
                        ?
                          <div>
                            <h4>Visualization options</h4>
                            <div className="view-options">
                              {
                              visualization
                              .viewOptions
                              .map((option, index) => (
                                <ViewOptionPicker
                                  option={option}
                                  activeValue={
                                    visualization.viewParameters && visualization.viewParameters[option.viewParameter]
                                  }
                                  onChange={setPresentationCandidateViewOption}
                                  visualizationId={visualizationKey}
                                  key={index} />
                              ))
                            }
                            </div>
                          </div>
                        : null}
                    </section>
                    <section className="modal-column">
                      <h4>How to color your categories ?</h4>
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
                      </section>
                    </section>
                    <section className="modal-column">
                      <h4>Visualization preview</h4>
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
                  </section> : null}
              </section>
            );
          })
        }
          </section> : null}
      </section>
      <section className="modal-footer">
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

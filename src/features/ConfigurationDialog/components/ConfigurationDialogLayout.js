/**
 * This module exports a stateless component rendering the layout of the configuration dialog feature interface
 * @module bulgur/features/ConfigurationDialog
 */
import React from 'react';
import PropTypes from 'prop-types';

import {validateFileExtensionForVisType} from '../../../helpers/fileLoader';

import Textarea from 'react-textarea-autosize';

import VisualizationPreviewContainer from './VisualizationPreviewContainer';

import ColorsMapPicker from '../../../components/ColorsMapPicker/ColorsMapPicker';
import DatamapPicker from '../../../components/DatamapPicker/DatamapPicker';
import DropZone from '../../../components/DropZone/DropZone';
import BigSelect from '../../../components/BigSelect/BigSelect';
import HelpPin from '../../../components/HelpPin/HelpPin';
import ViewOptionPicker from '../../../components/ViewOptionPicker/ViewOptionPicker';
import Toaster from '../../../components/Toaster/Toaster';
import {translateNameSpacer} from '../../../helpers/translateUtils';

import './ConfigurationDialog.scss';
/**
 * Renders the configuration dialog layout
 * @param {object} props - the props to render
 * @param {object} props.presentationCandidate - the data of the presentation to configure
 * @param {string} props.fetchUserFileStatus - the status of the file the user is trying to upload
 * @param {string} props.dataSourceTab - ui state for the source of data set by the user
 * @param {object} props.activeVisualizationTypes - models to display available visualization types
 * @param {object} props.visualizationTypesModels - models to use for displaying visualization type related configurations
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
    setDataSourceTab
  },
  closePresentationCandidate,
  onFileDrop,
  validateFileExtension,
  editedColor
}, context) => {
  const translate = translateNameSpacer(context.t, 'Features.ConfigurationDialog');
  const onApplyChange = () => applyPresentationCandidateConfiguration(presentationCandidate);
  const onDropInput = (files) => onFileDrop(files[0]);
  const setPresentationTitle = (e) => setCandidatePresentationMetadata('title', e.target.value);
  const setPresentationAuthors = (e) => setCandidatePresentationMetadata('authors', e.target.value);
  const setPresentationDescription = (e) => setCandidatePresentationMetadata('description', e.target.value);
  const setDataSourceComputer = () => setDataSourceTab('computer');
  const setDataSourceSample = () => setDataSourceTab('sample');
  const hasSlides = presentationCandidate.order && presentationCandidate.order.length;

  return (
    <div className="bulgur-ConfigurationDialogLayout">
      <h1 className="modal-header">
        {translate('presentation-configuration')}
      </h1>
      <section className="modal-content">
        <section className="modal-row">
          <h2>{translate('what-is-your-presentation-about')}
            <HelpPin>
              {translate('what-is-your-presentation-about-help')}
            </HelpPin>
          </h2>
          <form className="modal-columns-container">
            <div className="modal-column">
              <div className="input-group">
                <label htmlFor="title">{translate('title-of-the-presentation')}</label>
                <input
                  onChange={setPresentationTitle}
                  type="text"
                  name="title"
                  placeholder={translate('title-of-the-presentation')}
                  value={presentationCandidate.metadata.title || ''} />
              </div>

              <div className="input-group">
                <label htmlFor="authors">{translate('authors-of-the-presentation')}</label>
                <input
                  onChange={setPresentationAuthors}
                  type="text"
                  name="authors"
                  placeholder={translate('authors-of-the-presentation')}
                  value={presentationCandidate.metadata.authors || ''} />
              </div>
            </div>

            <div className="modal-column">
              <div className="input-group" style={{flex: 1}}>
                <label htmlFor="description">{translate('description-of-the-presentation')}</label>
                <Textarea
                  onChange={setPresentationDescription}
                  type="text"
                  name="description"
                  placeholder={translate('description-of-the-presentation')}
                  style={{flex: 1}}
                  value={presentationCandidate.metadata.description || ''} />
              </div>
            </div>
          </form>
        </section>

        <section className="modal-row">
          <h2>
            {translate('what-data-do-you-want-to-use')}
            <HelpPin>
              <a className="help-link" target="blank" href="https://github.com/medialab/bulgur/wiki/What-data-formats-and--tools-can-I-use-to-build-a-presentation-dataset-%3F">
                {translate('what-data-do-you-want-to-use-help')}
              </a>
            </HelpPin>
          </h2>

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
                      <h4>{translate('dataset-metadata')}</h4>
                      <div className="dataset-settings">
                        <form>
                          <div className="input-group">
                            <label htmlFor="title">{translate('title-of-the-dataset')}</label>
                            <input
                              onChange={setTitle}
                              type="text"
                              name="title"
                              placeholder={translate('title-of-the-dataset')}
                              value={dataset.metadata.title || ''} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="description">{translate('description-of-the-dataset')}</label>
                            <Textarea
                              onChange={setDescription}
                              type="text"
                              name="description"
                              placeholder={translate('description-of-the-dataset')}
                              value={dataset.metadata.description || ''} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="url">{translate('url-of-the-dataset')}</label>
                            <input
                              onChange={setUrl}
                              type="text"
                              name="url"
                              placeholder={translate('url-of-the-dataset')}
                              value={dataset.metadata.url || ''} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="license">{translate('license-of-the-dataset')}</label>
                            <input
                              onChange={setLicense}
                              type="text"
                              name="license"
                              placeholder={translate('license-of-the-dataset')}
                              value={dataset.metadata.license || ''} />
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="modal-column dataset-data">
                      <h4>{translate('dataset-data')}</h4>
                      <DropZone
                        onDrop={onDropNewData}>
                        <div>
                          <p>{translate('the-file-used-for-current-data-is')} <code>{dataset.metadata.fileName}</code>.</p>
                          <p>{translate('drop-a-file-to-update-with-new-data')}</p>
                        </div>
                      </DropZone>
                      {
                        // disabled if slides are present to avoid allowing bugs related to vis states without the required dataset
                        !hasSlides ?
                          <button className="remove-dataset" onClick={onRemoveDataset}>{translate('remove-this-dataset')}</button>
                        : null
                      }
                    </div>
                    <div className="modal-column dataset-preview">
                      <h4>{translate('dataset-preview')}</h4>
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
                  {translate('a-file-from-my-computer')}
                </li>
                <li onClick={setDataSourceSample} className={dataSourceTab === 'sample' ? 'active' : ''}>
                  {translate('a-sample-file')}
                </li>
              </ul>
              <section className="data-source-choice">
                {dataSourceTab === 'computer' ?
                  <section className="data-source">
                    <DropZone
                      onDrop={onDropInput}>
                      <div>{translate('drop-a-file-here')}</div>
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
                                <p className="pre-title"><i>{translate('sample-dataset')}</i></p>
                                <h3>{sample.title}</h3>
                              </div>
                              <div>
                                <p>{sample.description}</p>
                                <p className="recommended-vis-types">
                                  <b>{translate('recommended-for')} <i>{sample.recommendedVisTypes.map(type => type).join(', ')}</i>.</b>
                                </p>
                              </div>
                              <p>
                                <i>
                                  {translate('select-to-use-this-dataset')}
                                </i>
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

          <Toaster
            status={fetchUserFileStatus ? 'error' : undefined}
            log={fetchUserFileStatus} />
        </section>
        {presentationCandidate && presentationCandidate.datasets && Object.keys(presentationCandidate.datasets).length > 0 ?
          <section className="modal-row">
            {hasSlides ? <h2>{translate('how-to-visualize-the-data')} <HelpPin>
              {translate('how-to-visualize-the-data-help')}
            </HelpPin></h2> : null}
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
                      <h4>{translate('how-to-map-your-data-to-the-visualization')}</h4>
                      {visualization.metadata
                        && visualization.metadata.visualizationType
                        && visualization.viewParameters
                        && visualization.viewParameters.dataMap ?
                          <ul className="parameters-endpoints">
                            {
                            Object.keys(visualization.viewParameters.dataMap)
                            .map(collectionId => {
                              const collectionMap = visualization.viewParameters.dataMap[collectionId];
                              return (
                                <div className="datamap-group" key={collectionId}>
                                  {Object.keys(visualization.viewParameters.dataMap).length > 1 ?
                                    <h5>{translate('collection-mapping-parameters', {collection: collectionId})}</h5>
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
                            <h4>{translate('visualization-options')}</h4>
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
                      <h4>{translate('how-to-color-your-categories')}</h4>
                      <section className="final-touch-container">
                        {// colors edition
                      visualization.viewParameters && visualization.viewParameters.colorsMap ?
                        <ColorsMapPicker
                          colorsMap={visualization.viewParameters.colorsMap}
                          visualizationId={visualizationKey}
                          editedColor={editedColor}
                          changeColor={setPresentationCandidateColor}
                          toggleColorEdition={toggleCandidateColorEdition} />
                     : null}
                      </section>
                    </section>
                    <section className="modal-column">
                      <h4>{translate('visualization-preview')}</h4>
                      {// preview
                    visualization.dataProfile &&
                    visualization.data &&
                    visualization.viewParameters &&
                    visualization.viewParameters.colorsMap &&
                    visualization.viewParameters.dataMap ?
                      <VisualizationPreviewContainer
                        visualization={visualization}
                        visualizationKey={visualizationKey}
                        hasSlides={hasSlides} />
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
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].viewParameters &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].viewParameters.colorsMap &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].viewParameters.dataMap &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].dataProfile &&
          presentationCandidate.visualizations[Object.keys(presentationCandidate.visualizations)[0]].data
        ?
          <button
            className="valid-btn"
            onClick={onApplyChange}>{hasSlides ? translate('apply-changes-and-continue-presentation-edition') : translate('start-to-edit-this-presentation')}</button>
        : ''
      }
        <button
          className="cancel-btn"
          onClick={closePresentationCandidate}>
          {translate('cancel')}
        </button>
      </section>
    </div>
);
};

ConfigurationDialogLayout.contextTypes = {
  t: PropTypes.func.isRequired
};
export default ConfigurationDialogLayout;

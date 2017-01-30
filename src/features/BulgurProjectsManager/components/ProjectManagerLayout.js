import React from 'react';

import './ProjectManagerLayout.scss';

const ProjectManagerLayout = ({
  // activePresentation,
  // activePresentationId,
  promptedToDeleteId,
  presentationsList = [],
  actions: {
    promptDeletePresentation,
    deletePresentation,
    createPresentation
  }
}) => {
  const onCreatePresentation = () => {
    createPresentation('f1ddbb99-4922-4148-bdb3-5cc862c4aec6', {
      id: 'f1ddbb99-4922-4148-bdb3-5cc862c4aec6',
      metadata: {
        title: 'Ma présentation',
      }
    });
  };
  return (
    <section className="project-manager-layout">
      <section>
        <h1>Bulgur</h1>
        <p>
        Bulgur lets you make data presentations through commented maps, graphs or timelines, then export your presentation wherever you want on the web.
      </p>
        <p>
        Bulgur is part of the sciencespo’s médialab tools ecosystem :
      </p>
        <ul>
          <li>
          table2net
        </li>
          <li>
          bulgur
        </li>
          <li>
          fonio
        </li>
        </ul>
      </section>

      <section>
        <button onClick={onCreatePresentation}>Start a new presentation</button>
        <div />
      </section>

      <section>
        <ul>
          {presentationsList.map((presentation, index) => {
          const onClickPrompt = () => promptDeletePresentation(presentation.id);
          const onClickDelete = () => deletePresentation(presentation.id);
          return (
            <li key={index}>
              <span>{presentation.metadata.title}</span>
              <span>{promptedToDeleteId === presentation.id ? 'Sure ?' : ''}</span>
              {promptedToDeleteId === presentation.id ? <button onClick={onClickDelete}>Delete sure</button> : <button onClick={onClickPrompt}>Delete</button>}
            </li>
          );
        })
        }
        </ul>
      </section>
    </section>
  );
};

export default ProjectManagerLayout;

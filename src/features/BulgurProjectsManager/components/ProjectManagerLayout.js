import React from 'react';

import './ProjectManagerLayout.scss';

const ProjectManagerLayout = ({
}) => (
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
      <button>Start a new presentation</button>
      <div />
    </section>

    <section>
      <ul>
        <li>Projet 1</li>
        <li>Projet 2</li>
        <li>Projet 3</li>
        <li>Projet 4</li>
      </ul>
    </section>
  </section>
);

export default ProjectManagerLayout;

/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import styles from './style';
import React from 'react';
import ProjectDeclarationSummary from '../project-declaration-summary';
import {
  getProjectTypeString
} from '../../../../stores/config-store';
import classNames from 'classnames';
import PopOver from '../../../pop-over';
import Dropdown from '../../../dropdown';
import {AdminActions} from '../../../../actions/admin-actions';
import { ROLES } from '../../../../../../coi-constants';

function getUniqueProjects(declarations, configState) {
  const projects = [];
  const alreadyAdded = {};

  declarations.forEach(declaration => {
    if (!alreadyAdded[declaration.projectId]) {
      const projectType = getProjectTypeString(
        configState,
        declaration.projectTypeCd,
        configState.config.id
      );

      let sponsors;
      if (declaration.sponsors && Array.isArray(declaration.sponsors)) {
        sponsors = declaration.sponsors
          .map(sponsor => sponsor.sponsorName)
          .join(', ');
      }

      projects.push({
        id: declaration.projectId,
        name: declaration.projectTitle,
        type: projectType,
        sourceIdentifier: declaration.sourceIdentifier,
        role: declaration.roleDescription,
        sponsors,
        dispositionTypeCd: declaration.dispositionTypeCd,
        projectPersonId: declaration.projectPersonId
      });
      alreadyAdded[declaration.projectId] = true;
    }
  });

  projects.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return projects;
}

export class AdminDeclarationsSummary extends React.Component {
  constructor() {
    super();

    this.setAllProjectDispositions = this.setAllProjectDispositions.bind(this);
  }

  setAllProjectDispositions(newValue) {
    if (this.context.userInfo.coiRole === ROLES.ADMIN) {
      AdminActions.setAllProjectDispositions(newValue);
    }
    else if (this.context.userInfo.coiRole === ROLES.REVIEWER) {
      AdminActions.setAllRecommendedProjectDispositions(newValue);
    }

    document.body.click();
  }

  render() {
    const {
      declarations,
      className,
      comments,
      configId,
      piResponses,
      projectRecommendations,
      readonly
    } = this.props;

    let projects = [];

    let dispositionTypeOptions = [];
    const { config } = this.context.configState;
    let setAllButton;

    const isAdmin = this.context.userInfo.coiRole === ROLES.ADMIN;
    const isReviewer = this.context.userInfo.coiRole === ROLES.REVIEWER;

    if (
      config.general.dispositionsEnabled &&
      Array.isArray(config.dispositionTypes)
    ) {
      dispositionTypeOptions = config.dispositionTypes
        .filter(type => Boolean(type.active))
        .map(type => {
          return {
            value: type.typeCd,
            label: type.description
          };
        });
      
      if (
        !readonly &&
        (
          isAdmin ||
          (
            isReviewer &&
            config.general.reviewerDispositionsEnabled
          )
        )
      ) {
        setAllButton = (
          <button id="setAllProjectDispositions" className={styles.setAllLink}>
            Set All Project Dispositions
          </button>
        );
      }
    }

    if (declarations.length > 0) {
      const uniqueProjects = getUniqueProjects(
        declarations,
        this.context.configState
      );

      projects = uniqueProjects.map((project, index) => {
        const declarationSummaries = declarations.filter(
          d => d.projectId === project.id && d.finEntityActive === 1
        );

        return (
          <ProjectDeclarationSummary
            key={project.id}
            comments={comments}
            configId={configId}
            declarations={declarationSummaries}
            dispositionTypeOptions={dispositionTypeOptions}
            last={index === uniqueProjects.length - 1}
            piResponses={piResponses}
            project={project}
            projectRecommendations={projectRecommendations}
            readonly={readonly}
          />
        );
      });
    }
    else {
      projects = (
        <div className={styles.noProjects}>
          No projects on disclosure
        </div>
      );
    }

    return (
      <div className={classNames(styles.container, className)} >
        <div className={styles.heading}>
          <span>PROJECT DECLARATIONS</span>
          {setAllButton}
          <PopOver
            triggerId="setAllProjectDispositions"
            style={{top: 43, right: 30}}
          >
            <Dropdown
              options={dispositionTypeOptions}
              onChange={this.setAllProjectDispositions}
              className={styles.setAllDropdown}
            />
          </PopOver>
        </div>
        <div className={styles.body}>
          {projects}
        </div>
      </div>
    );
  }
}

AdminDeclarationsSummary.contextTypes = {
  configState: React.PropTypes.object,
  userInfo: React.PropTypes.object
};

AdminDeclarationsSummary.propTypes = {
  declarations: React.PropTypes.array,
  className: React.PropTypes.string,
  comments: React.PropTypes.array,
  configId: React.PropTypes.number.isRequired,
  piResponses: React.PropTypes.array,
  projectRecommendations: React.PropTypes.array,
  readonly: React.PropTypes.bool
};

AdminDeclarationsSummary.defaultProps = {
  declarations: [],
  comments: [],
  piResponses: [],
  readonly: false
};

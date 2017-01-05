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

import React from 'react';
import {
  getDispositionTypeString
} from '../../stores/config-store';
import PopOver from '../pop-over';
import styles from './style';

let latestId = 10;

export default function RecommendationLink(props, {configState}) {
  const {recommendations, configId} = props;

  if (recommendations) {
    const recommendationsJsx = recommendations.map(recommendation => {
      const answer = getDispositionTypeString(
        configState,
        recommendation.disposition,
        configId
      );
      return (
        <div key={recommendation.usersName}>
          <span className={styles.userName}>{recommendation.usersName}:</span>
          <span className={styles.reviewerRecommendation}>{answer}</span>
        </div>
      );
    });

    const linkId = `recommendLink${latestId}`;
    latestId++;

    return (
      <div style={{position: 'relative', fontSize: 12}}>
        <button
          id={linkId}
          className={styles.reviewerRecommendations}
        >
          View Reviewer Recommendations
        </button>
        <PopOver triggerId={linkId} style={{top: 32}}>
          {recommendationsJsx}
        </PopOver>
      </div>
    );
  }

  return <span />; // This is not needed once we are on React 0.15+
}

RecommendationLink.contextTypes = {
  configState: React.PropTypes.object
};

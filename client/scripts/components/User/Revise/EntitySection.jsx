/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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
import {merge} from '../../../merge';
import EntityToReview from './EntityToReview';

export default class EntitySection extends React.Component {
  render() {
    let styles = {
      container: {
        margin: '25px 20px 25px 35px',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 10px 2px #DDD',
        overflow: 'hidden'
      },
      title: {
        fontSize: 23,
        padding: '10px 18px',
        borderBottom: '1px solid #DDD',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white'
      },
      body: {
        padding: 23
      }
    };

    let entities = this.props.entitiesToReview.map((entitytoReview, index) => {
      return (
        <EntityToReview
          key={entitytoReview.id}
          entity={entitytoReview}
          respondedTo={entitytoReview.respondedTo}
          revised={entitytoReview.revised}
          style={{marginBottom: index === this.props.entitiesToReview.length - 1 ? 0 : 50}}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          FINANCIAL ENTITIES
        </div>
        <div style={styles.body}>
          {entities}
        </div>
      </div>
    );
  }
}

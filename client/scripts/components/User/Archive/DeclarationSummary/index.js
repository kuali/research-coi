/* @flow */
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

export default function DeclarationSummary(props: Object): React.Element {
  const styles = {
    container: {
      fontSize: 12,
      marginBottom: 10
    },
    highlighted: {
      borderLeft: window.colorBlindModeOn ? '10px solid black' : '10px solid #F57C00',
      marginLeft: -20,
      paddingLeft: 10
    },
    entityName: {
      width: '25%',
      display: 'inline-block'
    },
    conflict: {
      width: '25%',
      display: 'inline-block'
    },
    comments: {
      width: '50%',
      display: 'inline-block',
      verticalAlign: 'top'
    },
    commentLink: {
      fontSize: 14,
      cursor: 'pointer',
      margin: '14px 0 34px 0',
      textAlign: 'right'
    },
    commentLabel: {
      color: window.colorBlindModeOn ? 'black' : '#0095A0',
      borderBottom: window.colorBlindModeOn ? '1px dashed black' : '1px dashed #0095A0',
      paddingBottom: 3
    }
  };

  let effectiveStyle = styles.container;
  effectiveStyle = merge(effectiveStyle, props.style);

  return (
    <div style={effectiveStyle}>
      <div>
        <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
          {props.declaration.entityName}
        </span>
        <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
          {props.disposition}
        </span>
        <span style={merge(styles.comments, {fontStyle: 'italic'})}>
          {props.declaration.comments}
        </span>
      </div>
    </div>
  );
}

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
import {AdminActions} from '../../../actions/AdminActions';

export default function AdditionalReviewPanel(props: Object): React.Element {
  const styles = {
    container: {
      backgroundColor: 'white',
      height: '100%',
      boxShadow: '0 0 10px 0 #AAA'
    },
    close: {
      float: 'right',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: 8,
      color: window.colorBlindModeOn ? 'black' : '#0095A0',
      fontSize: 20
    },
    title: {
      fontSize: 22,
      fontWeight: 300,
      borderBottom: '1px solid #888'
    },
    fileLink: {
      color: window.colorBlindModeOn ? 'black' : '#0095A0',
      borderBottom: `1px dotted ${(window.colorBlindModeOn ? 'black' : '#0095A0')}`
    },
    heading: {
      color: 'black',
      padding: '18px 20px 10px 20px',
      marginBottom: 20
    },
    files: {
      padding: '0 20px'
    }
  };

  const files = props.files.map(file => {
    return (
      <div key={file.id} style={{marginBottom: 5}}>
        <a style={styles.fileLink} href={`/api/coi/files/${encodeURIComponent(file.id)}`}>{file.name}</a>
      </div>
    );
  });
  return (
  <div style={merge(styles.container, props.style)}>
    <div style={styles.heading}>
      <span style={styles.close} onClick={AdminActions.hideGeneralAttachmentsPanel}>
        <i className="fa fa-times" style={{fontSize: 23}}></i> CLOSE
      </span>
      <span style={styles.title}>ATTACHMENTS</span>
    </div>
    <div style={styles.files}>
      {files}
    </div>

  </div>
  );
}

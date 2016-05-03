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
import {DisclosureActions} from '../../../actions/disclosure-actions';
import {GreyButton} from '../../grey-button';
import VerticalSlider from '../../vertical-slider';
import {Editor, convertFromRaw, EditorState, ContentState} from 'draft-js';
import { decorator } from '../../../editor-utils';
import { LANES } from '../../../../../coi-constants';

export function Instructions(props) {

  let instruction;
  if(window.config.lane === LANES.TEST && props.contentState) {
    const blocks = convertFromRaw(props.contentState);
    const editorState = EditorState.createWithContent(ContentState.createFromBlockArray(blocks), decorator);
    instruction = (
      <Editor
        editorState={editorState}
        readOnly={true}
      />
    );
  } else {
    instruction = (
      <div>{props.text}</div>
    );
  }


  return (
    <VerticalSlider collapsed={props.collapsed}>
      <div className={`${styles.container} ${props.className}`}>
        <div className={styles.arrow}></div>
        {instruction}
        <div className={styles.buttons}>
          <GreyButton
            className={`${styles.override} ${styles.closeButton}`}
            onClick={DisclosureActions.toggleInstructions}
          >
            CLOSE
          </GreyButton>
        </div>
      </div>
    </VerticalSlider>
  );
}

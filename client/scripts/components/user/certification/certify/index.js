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
import classNames from 'classnames';
import React from 'react';
import {COIConstants} from '../../../../../../coi-constants';
import {Instructions} from '../../instructions';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {FileUpload} from '../../../file-upload';

export class Certify extends React.Component {
  constructor() {
    super();

    this.certify = this.certify.bind(this);
    this.addDisclosureAttachment = this.addDisclosureAttachment.bind(this);
    this.deleteDisclosureAttachment = this.deleteDisclosureAttachment.bind(this);
  }

  addDisclosureAttachment(files) {
    DisclosureActions.addDisclosureAttachment(files);
  }

  deleteDisclosureAttachment(index) {
    DisclosureActions.deleteDisclosureAttachment(index);
  }

  certify(evt) {
    DisclosureActions.certify(evt.target.checked);
  }

  shouldComponentUpdate() { return true; }

  render() {
    const {config} = this.context.configState;
    const instructionText = config.general.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION];
    const contentState = config.general.richTextInstructions ?
      config.general.richTextInstructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION] :
      undefined;
    const instructions = (
      <Instructions
        text={instructionText}
        contentState={contentState}
        collapsed={!this.props.instructionsShowing[COIConstants.INSTRUCTION_STEP.CERTIFICATION]}
      />
    );

    let agreement;

    if (config.general.certificationOptions.required) {
      agreement = (
        <div style={{marginTop: 20}}>
          <span style={{display: 'inline-block', width: '5%'}}>
            <input type="checkbox" id="certCheckbox" onChange={this.certify} checked={this.props.isCertified}/>
          </span>
          <label htmlFor="certCheckbox" style={{display: 'inline-block', width: '95%', verticalAlign: 'top', fontWeight: 'bold'}}>
            I acknowledge that it is my responsibility to disclose any new SIGNIFICANT FINANCIAL
            INTERESTS obtained during the term of this disclosure. I certify that this is a complete
            disclosure of all my financial interests related to the projects therein.
          </label>
        </div>
      );
    }

    let disclosureFiles;
    if (this.props.files) {
      disclosureFiles = this.props.files.filter(
        file => file.fileType === COIConstants.FILE_TYPE.DISCLOSURE
      );
    }

    return (
      <div className={classNames(styles.container, this.props.className)}>
        {instructions}

        <div className={styles.content}>
          <span className={styles.cert}>
            <div style={{whiteSpace: 'pre-wrap', marginBottom: 25}}>
              {config.general.certificationOptions.text}
            </div>
            <FileUpload
              fileType='Attachment'
              readOnly={false}
              onDrop={this.addDisclosureAttachment}
              delete={this.deleteDisclosureAttachment}
              files={disclosureFiles}
              multiple={true}
            >
              <div>Drag and Drop or Click to upload your attachments</div>
              <div>Acceptable Formats: .pdf, .png, .doc, .jpeg</div>
            </FileUpload>
            {agreement}
          </span>
        </div>
      </div>
    );
  }
}

Certify.contextTypes = {
  configState: React.PropTypes.object
};

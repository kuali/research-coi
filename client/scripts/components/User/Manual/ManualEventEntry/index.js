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

import styles from './style';
import React from 'react';
import {DisclosureActions} from '../../../../actions/DisclosureActions';
import {ManualPlaceholder} from '../../../DynamicIcons/ManualPlaceholder';
import {BlueButton} from '../../../BlueButton';

export class ManualEventEntry extends React.Component {
  constructor() {
    super();

    this.typeSelected = this.typeSelected.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
  }

  shouldComponentUpdate() { return true; }

  typeSelected() {
    DisclosureActions.manualTypeSelected();
  }

  saveProject() {
    DisclosureActions.saveManualEvent(
      this.refs.id.value,
      this.refs.title.value,
      this.refs.sponsor.value,
      this.refs.role.value,
      this.refs.amount.value,
      this.refs.projectType.value,
      this.refs.startdate.value,
      this.refs.enddate.value
    );
  }

  nextScreen() {
    DisclosureActions.doneEditingManualEvent(this.props.disclosure.id);
  }

  render() {
    let middle;
    if (this.props.step === 2) {
      const disclosure = this.props.disclosure;
      middle = (
        <div style={{marginTop: 27}}>
          <div className={styles.row}>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT ID:</div>
              <input onChange={this.saveProject} value={disclosure.projectId} ref="id" type="text" className={styles.textfield} />
            </span>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT TITLE:</div>
              <input onChange={this.saveProject} value={disclosure.title} ref="title" type="text" className={styles.textfield} />
            </span>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>SPONSOR:</div>
              <input onChange={this.saveProject} value={disclosure.sponsor} ref="sponsor" type="text" className={styles.textfield} />
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT ROLE:</div>
              <input onChange={this.saveProject} value={disclosure.role} ref="role" type="text" className={styles.textfield} />
            </span>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT FUNDING AMOUNT:</div>
              <input onChange={this.saveProject} value={disclosure.amount} ref="amount" type="text" className={styles.textfield} />
            </span>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT TYPE:</div>
              <select onChange={this.saveProject} value={disclosure.projectType} ref="projectType" className={styles.projectTypeSelect}>
                <option value="Resubmission">Resubmission</option>
                <option value="Classification">Classification</option>
                <option value="Research">Research</option>
                <option value="Administration">Administration</option>
              </select>
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT START DATE:</div>
              <input onChange={this.saveProject} value={disclosure.startdate} ref="startdate" type="date" className={styles.textfield} />
            </span>
            <span className={styles.cell}>
              <div className={styles.cellLabel}>PROJECT END DATE:</div>
              <input onChange={this.saveProject} value={disclosure.enddate} ref="enddate" type="date" className={styles.textfield} />
            </span>
            <span className={styles.cell} style={{textAlign: 'right'}}>
              <BlueButton
                onClick={this.nextScreen}
                className={`${styles.override} ${styles.saveButton}`}
              >
                Done
              </BlueButton>
            </span>
          </div>
        </div>
      );
    }
    else {
      middle = (
        <div style={{textAlign: 'center'}}>
          <ManualPlaceholder className={`${styles.override} ${styles.image}`} />
          <div className={styles.instructions}>
            Select your event type above to begin building your manual event.
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <div className={styles.label} >EVENT TYPE:</div>
        <div>
          <select ref="manualType" onChange={this.typeSelected} className={styles.select} value={this.props.selected}>
            <option value="">SELECT</option>
            <option value="AWARD">Manual Award</option>
            <option value="PROPOSAL">Manual Proposal</option>
            <option value="IRB">Manual IRB Proposal</option>
            <option value="TRAVEL">Travel Disclosure</option>
            <option value="IACUC">Manual IACUC Proposal</option>
          </select>
        </div>

        {middle}
      </div>
    );
  }
}

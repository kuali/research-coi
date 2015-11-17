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

import React from 'react'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ManualPlaceholder} from '../../DynamicIcons/ManualPlaceholder';
import {BlueButton} from '../../BlueButton';

export class ManualEventEntry extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.typeSelected = this.typeSelected.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.nextScreen = this.nextScreen.bind(this);
  }

  shouldComponentUpdate() { return true; }

  typeSelected() {
    DisclosureActions.manualTypeSelected(
      this.props.disclosure.id,
      this.refs.manualType.value
    );
  }

  saveProject() {
    DisclosureActions.saveManualEvent(
      this.props.disclosure.id,
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

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      select: {
        fontSize: 16,
        height: 30,
        backgroundColor: 'white'
      },
      label: {
        fontSize: 12
      },
      image: {
        display: 'block',
        width: 300,
        height: 300,
        colorOne: window.config.colors.one,
        colorTwo: window.config.colors.two,
        margin: '-12px auto 0 auto'
      },
      instructions: {
        width: 320,
        display: 'block',
        margin: '10px auto 0 auto'
      },
      cell: {
        width: '33%',
        display: 'inline-block',
        padding: 10
      },
      cellLabel: {
        fontSize: 12,
        color: window.config.colors.one
      },
      saveButton: {
        padding: '6px 12px',
        fontSize: 15,
        width: 'initial'
      },
      row: {
        marginBottom: 5
      },
      textfield: {
        width: '100%',
        height: 31,
        fontSize: 16,
        padding: '0 7px',
        fontFamily: 'Lato'
      },
      projectTypeSelect: {
        width: '100%',
        height: 30,
        fontSize: 16,
        background: 'white',
        outline: 0,
        fontFamily: 'Lato'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let middle;
    if (this.props.step === 2) {
      let disclosure = this.props.disclosure;
      middle = (
        <div style={{marginTop: 27}}>
          <div style={styles.row}>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT ID:</div>
              <input onChange={this.saveProject} value={disclosure.projectId} ref="id" type="text" style={styles.textfield} />
            </span>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT TITLE:</div>
              <input onChange={this.saveProject} value={disclosure.title} ref="title" type="text" style={styles.textfield} />
            </span>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>SPONSOR:</div>
              <input onChange={this.saveProject} value={disclosure.sponsor} ref="sponsor" type="text" style={styles.textfield} />
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT ROLE:</div>
              <input onChange={this.saveProject} value={disclosure.role} ref="role" type="text" style={styles.textfield} />
            </span>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT FUNDING AMOUNT:</div>
              <input onChange={this.saveProject} value={disclosure.amount} ref="amount" type="text" style={styles.textfield} />
            </span>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT TYPE:</div>
              <select onChange={this.saveProject} value={disclosure.projectType} ref="projectType" style={styles.projectTypeSelect}>
                <option value="Resubmission">Resubmission</option>
                <option value="Classification">Classification</option>
                <option value="Research">Research</option>
                <option value="Administration">Administration</option>
              </select>
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT START DATE:</div>
              <input onChange={this.saveProject} value={disclosure.startdate} ref="startdate" type="date" style={styles.textfield} />
            </span>
            <span style={styles.cell}>
              <div style={styles.cellLabel}>PROJECT END DATE:</div>
              <input onChange={this.saveProject} value={disclosure.enddate} ref="enddate" type="date" style={styles.textfield} />
            </span>
            <span style={merge(styles.cell, {textAlign: 'right'})}>
              <BlueButton onClick={this.nextScreen} style={styles.saveButton}>Done</BlueButton>
            </span>
          </div>
        </div>
      );
    }
    else {
      middle = (
        <div style={{textAlign: 'center'}}>
          <ManualPlaceholder style={styles.image} />
          <div style={styles.instructions}>
            Select your event type above to begin building your manual event.
          </div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.label} >EVENT TYPE:</div>
        <div>
          <select ref="manualType" onChange={this.typeSelected} style={styles.select} value={this.props.selected}>
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

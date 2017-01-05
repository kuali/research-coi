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
import EntityToReview from '../entity-to-review';
import {BlueButton} from '../../../blue-button';
import {EntityForm} from '../../entities/entity-form';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import PIReviewActions from '../../../../actions/pi-review-actions';

let nextFakeEntityId = -1;

export default class EntitySection extends React.Component {
  constructor() {
    super();

    const storeState = DisclosureStore.getState();
    this.state = {
      appState: storeState.applicationState
    };

    this.onChange = this.onChange.bind(this);
    this.submitEntity = this.submitEntity.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.setCurrentDisclosureId(this.props.disclosureId);
    this.onChange();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = DisclosureStore.getState();
    this.setState({
      appState: storeState.applicationState
    });
  }

  submitEntity(entity) {
    entity.id = nextFakeEntityId--;
    PIReviewActions.addEntity(entity);
  }

  render() {
    const {entitiesToReview, className} = this.props;

    const entities = entitiesToReview.map((entitytoReview, index) => {
      return (
        <EntityToReview
          key={entitytoReview.id}
          entity={entitytoReview}
          respondedTo={entitytoReview.respondedTo}
          revised={entitytoReview.revised}
          className={classNames(
            styles.override,
            styles.entity,
            {[styles.last]: index === entitiesToReview.length - 1}
          )}
          appState={this.state.appState}
        />
      );
    });

    let entityForm;
    if (this.state.appState.newEntityFormStep >= 0) {
      entityForm = (
        <EntityForm
          step={this.state.appState.newEntityFormStep}
          entity={this.state.appState.entityInProgress}
          editing={true}
          appState={this.state.appState}
          className={'fill'}
          onSubmit={this.submitEntity}
          duringRevision={true}
        />
      );
    }

    let addSection;
    if (this.state.appState.newEntityFormStep < 0) {
      addSection = (
        <div className={styles.addSection}>
          <BlueButton onClick={DisclosureActions.newEntityInitiated}>
            + Add Another Entity
          </BlueButton>
        </div>
      );
    }

    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.title}>
          FINANCIAL ENTITIES
        </div>
        <div className={styles.body}>
          {entities}
        </div>
        <div className={'flexbox row'}>
          <span style={{minWidth: 45}} />
          {entityForm}
          <span className={styles.spacer} />
        </div>
        {addSection}
      </div>
    );
  }
}

EntitySection.propTypes = {
  entitiesToReview: React.PropTypes.array.isRequired,
  className: React.PropTypes.string,
  disclosureId: React.PropTypes.number.isRequired
};

EntitySection.defaultProps = {
  className: '',
};

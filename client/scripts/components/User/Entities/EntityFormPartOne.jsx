import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {SponsorField} from './SponsorField';
import {TypeField} from './TypeField';
import {PublicField} from './PublicField';
import {DescriptionField} from './DescriptionField';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';

export class EntityFormPartOne extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setType = this.setType.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.setSponsor = this.setSponsor.bind(this);
    this.setDescription = this.setDescription.bind(this);
  }

  setType(newType) {
    DisclosureActions.setEntityType(newType, this.props.id);
  }

  setPublic(newValue) {
    DisclosureActions.setEntityPublic(newValue, this.props.id);
  }

  setSponsor(newValue) {
    DisclosureActions.setEntityIsSponsor(newValue, this.props.id);
  }

  setDescription(newDescription) {
    DisclosureActions.setEntityDescription(newDescription, this.props.id);
  }

  renderMobile() {}

  renderDesktop() {
    let validationErrors = DisclosureStore.entityStepOneErrors();

    let desktopStyles = {
      container: {
      },
      title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#1481A3'
      },
      left: {
        width: '33%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      right: {
        width: '66%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      middle: {
        width: '100%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      innerRight: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let heading = null;
    if (!this.props.update) {
      if (this.props.name) {
        heading = (
          <div style={styles.title}>{this.props.name} Information</div>
        );
      }
      else {
        heading = (
          <div style={styles.title}>Add New Financial Entity</div>
        );
      }
    }

    let type = this.props.type;
    let isPublic = this.props.isPublic;
    let description = this.props.description;

    let sponsorValue;
    if (this.props.isSponsor) {
      sponsorValue = 'Yes';
    }
    else if (this.props.isSponsor === undefined) {
      sponsorValue = 'Not Set';
    }
    else {
      sponsorValue = 'No';
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        {heading}

        <div style={{marginTop: this.props.update ? 0 : 20}}>
          <span style={styles.left}>
            <div style={{marginBottom: 20}}>
              <TypeField
                value={type}
                readonly={this.props.readonly}
                onChange={this.setType}
                invalid={this.props.validating && validationErrors.type}
              />
            </div>
            <div>
              <SponsorField
                value={sponsorValue}
                readonly={this.props.readonly}
                onChange={this.setSponsor}
                invalid={this.props.validating && validationErrors.isSponsor}
              />
            </div>
          </span>
          <span style={styles.right}>
            <div style={{marginBottom: 20}}>
              <span style={styles.middle}>
                <PublicField
                  value={isPublic}
                  readonly={this.props.readonly}
                  onChange={this.setPublic}
                  invalid={this.props.validating && validationErrors.isPublic}
                />
              </span>
            </div>
            <div>
              <DescriptionField
                value={description}
                readonly={this.props.readonly}
                onChange={this.setDescription}
                invalid={this.props.validating && validationErrors.description}
              />
            </div>
          </span>
        </div>
      </span>
    );
  }
}

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {SponsorField} from './SponsorField';
import {TypeField} from './TypeField';
import {PublicField} from './PublicField';
import {DescriptionField} from './DescriptionField';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class EntityFormPartOne extends ResponsiveComponent {
  constructor(props) {
    super();
    this.commonStyles = {};

    this.state = {
      validStatus: {
        status: props.status && props.status.length > 0,
        type: props.type && props.type.length > 0,
        public: props.isPublic && props.isPublic.length > 0,
        sponsor: props.update ? true : undefined,
        description: props.description && props.description.length > 0
      }
    };

    this.updateFieldValidity = this.updateFieldValidity.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.setType = this.setType.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.setSponsor = this.setSponsor.bind(this);
    this.setDescription = this.setDescription.bind(this);
  }

  updateFieldValidity(field, newValue) {
    let newValidStatus = {};
    newValidStatus[field] = newValue !== undefined && newValue.length > 0;

    this.setState({
      validStatus: merge(this.state.validStatus, newValidStatus)
    }, () => {
      this.props.onValidation(this.formIsValid());
    });
  }

  setType(newType) {
    this.updateFieldValidity('type', newType);
    DisclosureActions.setEntityType(newType, this.props.id);
  }

  setPublic(newValue) {
    this.updateFieldValidity('public', newValue);
    DisclosureActions.setEntityPublic(newValue, this.props.id);
  }

  setSponsor(newValue) {
    this.setState({
      validStatus: merge(this.state.validStatus, {
        sponsor: newValue !== undefined
      })
    }, () => {
      this.props.onValidation(this.formIsValid());
    });
    DisclosureActions.setEntityIsSponsor(newValue, this.props.id);
  }

  setDescription(newDescription) {
    this.updateFieldValidity('description', newDescription);
    DisclosureActions.setEntityDescription(newDescription, this.props.id);
  }

  formIsValid() {
    let fieldValid = field => {
      return (this.props.update && this.state.validStatus[field] === 'undefined') || this.state.validStatus[field];
    };

    return fieldValid('status') &&
           fieldValid('type') &&
           fieldValid('public') &&
           fieldValid('sponsor') &&
           fieldValid('description');
  }

  renderMobile() {}

  renderDesktop() {
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

    let status = this.props.status;
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
                invalid={this.state.validStatus.type === false}
              />
            </div>
            <div>
              <SponsorField
                value={sponsorValue}
                readonly={this.props.readonly}
                onChange={this.setSponsor}
                invalid={this.state.validStatus.sponsor === false}
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
                  invalid={this.state.validStatus.public === false}
                />
              </span>
            </div>
            <div>
              <DescriptionField
                value={description}
                readonly={this.props.readonly}
                onChange={this.setDescription}
                invalid={this.state.validStatus.description === false}
              />
            </div>
          </span>
        </div>
      </span>
    );
  }
}

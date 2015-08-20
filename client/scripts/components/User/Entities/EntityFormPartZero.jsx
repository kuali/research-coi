import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';

export class EntityFormPartZero extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.updateName = this.updateName.bind(this);
  }

  updateName() {
    let newNameValue = this.refs.entityName.getDOMNode().value;
    DisclosureActions.setInProgressEntityName(newNameValue);
  }

  renderMobile() {}

  renderDesktop() {
    let validationErrors = DisclosureStore.entityStepZeroErrors();

    let desktopStyles = {
      container: {
      },
      title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#1481A3'
      },
      entityName: {
        display: 'inline-block',
        marginRight: 20,
        width: 275,
        color: this.props.validating && validationErrors.name ? 'red' : 'inherit'
      },
      top: {
        marginTop: 20
      },
      bottom: {
        marginTop: 20
      },
      name: {
        padding: '2px 8px',
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #ccc',
        height: 30,
        width: '100%',
        borderBottom: this.props.validating && validationErrors.name ? '3px solid red' : '1px solid #ccc'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let requiredFieldError;
    if (this.props.validating && validationErrors.name) {
      requiredFieldError = (
        <div style={styles.invalidError}>{validationErrors.name}</div>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>Add New Financial Entity</div>

        <div style={styles.top}>
          <span style={styles.entityName}>
            <div style={{marginBottom: 5, fontWeight: '500'}}>Entity Name:</div>
            <div>
              <input required onChange={this.updateName} value={this.props.entityName} ref="entityName" type="text" style={styles.name} />
            </div>
            {requiredFieldError}
          </span>
        </div>
      </span>
    );
  }
}

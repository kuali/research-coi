import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class EntityFormPartZero extends ResponsiveComponent {
  constructor(props) {
    super();
    this.commonStyles = {};

    this.state = {
      validStatus: {
        entityName: props.entityName && props.entityName.length > 0
      }
    };

    this.updateName = this.updateName.bind(this);
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

  updateName() {
    let newNameValue = this.refs.entityName.getDOMNode().value;
    this.updateFieldValidity('entityName', newNameValue);
    DisclosureActions.setInProgressEntityName(newNameValue);
  }

  formIsValid() {
    return this.state.validStatus.entityName;
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
      entityName: {
        display: 'inline-block',
        marginRight: 20,
        width: 275,
        color: this.state.validStatus.entityName === false ? 'red' : 'inherit'
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
        borderBottom: this.state.validStatus.entityName === false ? '3px solid red' : '1px solid #ccc'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let requiredFieldError;
    if (this.state.validStatus.entityName === false) {
      requiredFieldError = (
        <div style={styles.invalidError}>Required Field</div>
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

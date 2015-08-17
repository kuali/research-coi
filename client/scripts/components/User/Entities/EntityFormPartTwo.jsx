import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {ToggleSet} from './ToggleSet';
import {RelationshipSummary} from './RelationshipSummary';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {KButton} from '../../KButton';

export class EntityFormPartTwo extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      typeOptions: [],
      relation: '',
      relations: [],
      validStatus: {
        type: false,
        amount: false,
        person: true,
        relationship: false
      }
    };

    this.addRelation = this.addRelation.bind(this);
    this.typeSelected = this.typeSelected.bind(this);
    this.amountSelected = this.amountSelected.bind(this);
    this.personSelected = this.personSelected.bind(this);
    this.relationChosen = this.relationChosen.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
    this.commentChanged = this.commentChanged.bind(this);
  }

  shouldComponentUpdate() { return true; }

  addRelation() {
    if (!this.formIsValid()) {
      return;
    }

    DisclosureActions.addEntityRelationship(this.props.id);

    this.setState({
      relation: '',
      validStatus: {
        type: false,
        amount: false,
        person: false,
        relationship: false
      }
    });
  }

  typeSelected() {
    DisclosureActions.setEntityRelationshipType(this.refs.typeSelect.getDOMNode().value);
  }

  amountSelected() {
    DisclosureActions.setEntityRelationshipAmount(this.refs.amountSelect.getDOMNode().value);
  }

  personSelected() {
    DisclosureActions.setEntityRelationshipPerson(this.refs.personSelect.getDOMNode().value);
  }

  commentChanged() {
    DisclosureActions.setEntityRelationshipComment(this.refs.commentTextArea.getDOMNode().value);
  }

  relationChosen(relation) {
    DisclosureActions.setEntityRelationshipRelation(relation);
    this.setState({
      relation: relation,
      validStatus: merge(this.state.validStatus, {
        relationship: true,
        type: false,
        amount: false
      })
    });

    switch (relation) {
      case 'Ownership':
        this.setState({
          typeOptions: [
            'Stock',
            'Stock Options',
            'Other Ownership'
          ]
        });
        break;
      case 'Offices/Positions':
        this.setState({
          typeOptions: [
            'Board Member',
            'Partner',
            'Other Managerial Positions',
            'Founder'
          ]
        });
        break;
      case 'Intellectual Property':
        this.setState({
          typeOptions: [
            'Royalty Income',
            'Intellectual Property Rights'
          ]
        });
        break;
      case 'Other':
        this.setState({
          typeOptions: [
            'Contract',
            'Other Transactions'
          ]
        });
        break;
      default:
        this.setState({
          typeOptions: []
        });
        break;
    }
  }

  formIsValid() {
    return true;

    // switch (this.state.relation) {
    //   case 'Offices/Positions':
    //     return this.state.validStatus.type &&
    //            this.state.validStatus.person &&
    //            this.state.validStatus.relationship;
    //   case 'Paid Activities':
    //     return this.state.validStatus.amount &&
    //            this.state.validStatus.person &&
    //            this.state.validStatus.relationship;
    //   default:
    //     return this.state.validStatus.type &&
    //            this.state.validStatus.amount &&
    //            this.state.validStatus.person &&
    //            this.state.validStatus.relationship;
    // }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        width: '100%'
      },
      title: {
        fontWeight: this.props.update ? 'normal' : 'bold',
        fontSize: 17,
        color: '#1481A3'
      },
      instructions: {
        fontSize: 14,
        marginBottom: 25,
        marginTop: 10
      },
      left: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '30%',
        paddingRight: 40
      },
      right: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '70%'
      },
      personSection: {
        marginBottom: 24,
        verticalAlign: 'top'
      },
      commentArea: {
        marginTop: 7
      },
      addButtonSection: {
        textAlign: 'right'
      },
      textarea: {
        height: 90,
        width: '100%',
        border: '1px solid #C7C7C7',
        fontSize: 16,
        padding: 5,
        borderRadius: 5
      },
      top: {
        marginBottom: 20
      },
      addButton: {
        backgroundColor: this.formIsValid() ? '#1481A3' : '#D8D8D8',
        color: this.formIsValid() ? 'white' : '#939393',
        padding: '3px 9px 4px 7px',
        marginTop: 10,
        cursor: this.formIsValid() ? 'pointer' : 'default',
        width: 'initial'
      },
      submittedrelations: {
        borderTop: '1px solid #DEDEDE',
        marginRight: 14,
        paddingTop: 20
      },
      typeSection: {
        marginBottom: 24,
        display: 'block'
      },
      amountSection: {
        textAlign: 'left',
        display: 'block'
      },
      dropDown: {
        width: '100%',
        height: 27,
        backgroundColor: 'transparent',
        fontSize: 14,
        borderBottom: '1px solid #aaa'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let typeSection;
    if (this.state.relation !== '' && this.state.relation !== 'Paid Activities') {
      let typeOptions = this.state.typeOptions.map(typeOption => {
        return (
          <option key={typeOption}>{typeOption}</option>
        );
      });

      typeSection = (
        <div style={styles.typeSection}>
          <div>Type</div>
          <select onChange={this.typeSelected} ref="typeSelect" value={this.props.appState.potentialRelationship.type} style={styles.dropDown}>
            <option value="">--SELECT--</option>
            {typeOptions}
          </select>
        </div>
      );
    }

    let amountSection;
    if (this.state.relation !== '' && this.state.relation !== 'Offices/Positions') {
      amountSection = (
        <div style={styles.amountSection}>
          <div>Amount</div>
          <select onChange={this.amountSelected} ref="amountSelect" value={this.props.appState.potentialRelationship.amount} style={styles.dropDown}>
            <option value="">--SELECT--</option>
            <option value="$1 - $5,000">$1 - $5,000</option>
            <option value="$5,001 - $10,000">$5,001 - $10,000</option>
            <option value="Over $10,000">Over $10,000</option>
            <option value="Privately held, no valuation">Privately held, no valuation</option>
            <option value="Does not apply">Does not apply</option>
          </select>
        </div>
      );
    }

    let relationshipSummaries = [];
    if (this.props.relations) {
      relationshipSummaries = this.props.relations.map(relation => {
        return (
          <RelationshipSummary
            readonly={this.props.readonly}
            entityId={this.props.id}
            style={{marginBottom: 20}}
            id={relation.id}
            person={relation.person}
            relationship={relation.relationship}
            type={relation.type}
            amount={relation.amount}
            comment={relation.comments}
            key={relation.id}
          />
        );
      });
    }

    let heading;
    if (this.props.update) {
      heading = 'Relationship Details';
    }
    else if (this.props.name) {
      heading = this.props.name + ' Relationship Details';
    }
    else {
      heading = 'Financial Entity Relationship Details';
    }

    let relationshipEditor;
    if (!this.props.readonly) {
      relationshipEditor = (
        <div>
          <div style={styles.title}>{heading}</div>

          <div style={styles.instructions}>
            <div>Use the builder below to indicate your relationships with this Financial Entity.</div>
          </div>

          <div style={styles.top}>
            <span style={styles.left}>
              <div style={styles.personSection}>
                <div>Person</div>
                <div>
                  <select onChange={this.personSelected} ref="personSelect" value={this.props.appState.potentialRelationship.person} style={styles.dropDown}>
                    <option value="">--SELECT--</option>
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Children">Children</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {typeSection}
              {amountSection}
            </span>
            <span style={styles.right}>
              <div>Relationship</div>
              <div>
                <ToggleSet
                  selected={this.props.appState.potentialRelationship.relationship}
                  onChoose={this.relationChosen}
                  values={[
                    'Ownership',
                    'Offices/Positions',
                    'Paid Activities',
                    'Intellectual Property',
                    'Other'
                  ]}
                />
              </div>

              <div style={styles.commentArea}>
                <div>Comments</div>
                <div>
                  <textarea onChange={this.commentChanged} value={this.props.appState.potentialRelationship.comments} style={styles.textarea} ref="commentTextArea" />
                </div>
              </div>
              <div style={styles.addButtonSection}>
                <KButton onClick={this.addRelation} style={styles.addButton}>+ Add Additional Relationship</KButton>
              </div>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {relationshipEditor}

        <div style={!this.props.readonly ? styles.submittedrelations : {}}>
          <div style={{color: this.props.update ? 'black' : '#555', marginBottom: 12}}>My Financial Entities:</div>
          {relationshipSummaries}
        </div>
      </div>
    );
  }
}

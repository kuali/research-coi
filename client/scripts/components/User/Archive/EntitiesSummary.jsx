import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import EntityRelationshipSummary from '../../EntityRelationshipSummary';

export class EntitiesSummary extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 15px #E6E6E6',
        backgroundColor: 'white'
      },
      heading: {
        backgroundColor: '#1481A3',
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'white',
        padding: 10
      },
      body: {
        padding: '0 20px'
      },
      footer: {
        borderTop: '1px solid #999',
        backgroundColor: '#1481A3',
        padding: '4px 15px',
        minHeight: 33,
        color: 'white'
      },
      button: {
        padding: '3px 7px',
        'float': 'right',
        marginRight: 10,
        fontSize: 12,
        width: 'initial'
      },
      relations: {
        display: 'inline-block',
        width: '60%',
        verticalAlign: 'top'
      },
      left: {
        display: 'inline-block',
        width: '40%',
        verticalAlign: 'top',
        fontSize: 13,
        paddingRight: 4
      },
      fieldLabel: {
        fontWeight: 'bold',
        display: 'inline-block'
      },
      fieldValue: {
        marginLeft: 4,
        display: 'inline-block'
      },
      descriptionLabel: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 2
      },
      relationshipDescription: {
        fontSize: 11,
        fontStyle: 'italic'
      },
      relationshipsLabel: {
        fontSize: 15,
        marginBottom: 8
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 11
      },
      entity: {
        borderBottom: '1px solid #999',
        padding: '20px 0'
      },
      lastEntity: {
        padding: '20px 0'
      },
      relationshipSummary: {
        marginBottom: 10
      }
    };

    let entities = [];
    if(this.props.entities !== undefined) {
      for (let i = 0; i < this.props.entities.length; i++) {
        let relationships = [];
        for (let j = 0; j < this.props.entities[i].relationships.length; j++) {
          relationships.push(
            <EntityRelationshipSummary
              key={i + ':' + j}
              style={styles.relationshipSummary}
              person={this.props.entities[i].relationships[j].person}
              relationship={this.props.entities[i].relationships[j].relationship}
              type={this.props.entities[i].relationships[j].type}
              amount={this.props.entities[i].relationships[j].amount}
              comment={this.props.entities[i].relationships[j].comments}
              readonly={true}
            />
          );
        }

        entities.push(
          <div
            key={i}
            style={(i === this.props.entities.length - 1) ? styles.lastEntity : styles.entity}
          >
            <div style={styles.name}>{this.props.entities[i].name}</div>
            <div>
              <span style={styles.left}>
                <div>
                  <span style={styles.fieldLabel}>Status:</span>
                  <span style={styles.fieldValue}>{this.props.entities[i].status}</span>
                </div>
                <div>
                  <span style={styles.fieldLabel}>Public/Private:</span>
                  <span style={styles.fieldValue}>{this.props.entities[i].public === 1 ? 'Public' : 'Private'}</span>
                </div>
                <div>
                  <span style={styles.fieldLabel}>Type:</span>
                  <span style={styles.fieldValue}>{this.props.entities[i].type}</span>
                </div>
                <div>
                  <span style={styles.fieldLabel}>Sponsor Research:</span>
                  <span style={styles.fieldValue}>{this.props.entities[i].sponsorResearch ? 'YES' : 'NO'}</span>
                </div>
                <div style={styles.descriptionLabel}>Description of Relationship</div>
                <div style={styles.relationshipDescription}>{this.props.entities[i].description}</div>
              </span>
              <span style={styles.relations}>
                <div style={styles.relationshipsLabel}>Relationship(s):</div>
                {relationships}
              </span>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>FINANCIAL ENTITIES</div>
        <div style={styles.body}>
          {entities}
        </div>
      </div>
    );
  }
}

import React from 'react/addons';
import {merge} from '../../../merge';
import DisclosureType from './DisclosureType';

export default class DisclosureTypes extends React.Component {
  constructor() {
    super();
    this.typeIsBeingEdited = this.typeIsBeingEdited.bind(this);
  }

  typeIsBeingEdited(type) {
    return this.props.appState &&
           this.props.appState.disclosureTypesBeingEdited[type.id] !== undefined;
  }

  render() {
    let styles = {
      container: {
        padding: '20px 23px 10px 23px',
        fontSize: 15
      },
      half: {
        width: '50%',
        display: 'inline-block'
      },
      optionRow: {
        paddingBottom: 20
      },
      editLink: {
        marginLeft: 10
      },
      checkbox: {
        marginRight: 10
      }
    };

    let rows;
    if (this.props.types) {
      rows = (
        <span>
          <div style={styles.optionRow}>
            <DisclosureType editMode={this.typeIsBeingEdited(this.props.types[0])} id={this.props.types[0].id} label={this.props.types[0].label} />
            <DisclosureType editMode={this.typeIsBeingEdited(this.props.types[1])} id={this.props.types[1].id} label={this.props.types[1].label} />
          </div>
          <div style={styles.optionRow}>
            <DisclosureType editMode={this.typeIsBeingEdited(this.props.types[2])} id={this.props.types[2].id} label={this.props.types[2].label} />
            <DisclosureType editMode={this.typeIsBeingEdited(this.props.types[3])} id={this.props.types[3].id} label={this.props.types[3].label} />
          </div>
        </span>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {rows}
      </div>
    );
  }
}

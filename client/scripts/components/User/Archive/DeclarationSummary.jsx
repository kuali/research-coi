import React from 'react/addons';
import {merge} from '../../../merge';

export default class extends React.Component {
  render() {
    let styles = {
      container: {
        fontSize: 12,
        marginBottom: 10
      },
      highlighted: {
        borderLeft: window.colorBlindModeOn ? '10px solid black' : '10px solid #F57C00',
        marginLeft: -20,
        paddingLeft: 10
      },
      entityName: {
        width: '25%',
        display: 'inline-block'
      },
      conflict: {
        width: '25%',
        display: 'inline-block'
      },
      comments: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      commentLink: {
        fontSize: 14,
        cursor: 'pointer',
        margin: '14px 0 34px 0',
        textAlign: 'right'
      },
      commentLabel: {
        color: window.colorBlindModeOn ? 'black' : '#0095A0',
        borderBottom: window.colorBlindModeOn ? '1px dashed black' : '1px dashed #0095A0',
        paddingBottom: 3
      }
    };

    let effectiveStyle = styles.container;
    effectiveStyle = merge(effectiveStyle, this.props.style);

    return (
      <div style={effectiveStyle}>
        <div>
          <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
            {this.props.declaration.entityName}
          </span>
          <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
            {this.props.disposition}
          </span>
          <span style={merge(styles.comments, {fontStyle: 'italic'})}>
            {this.props.declaration.comments}
          </span>
        </div>
      </div>
    );
  }
}

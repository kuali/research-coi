import React from 'react/addons';
import {merge} from '../../merge';
import {KButton} from '../KButton';

export default class PanelWithButtons extends React.Component {
  render() {
    let styles = {
      container: {
        borderRadius: 5,
        backgroundColor: 'white',
        boxShadow: '0 0 10px #BBB',
        marginBottom: 22
      },
      title: {
        borderBottom: '1px solid #AAA',
        padding: '10px 17px',
        fontSize: 17
      },
      content: {
        padding: 10
      },
      button: {
        marginLeft: 10,
        float: 'right'
      },
      buttonRow: {
        padding: '10px 20px',
        height: 53,
        borderTop: '1px solid #AAA'
      }
    };

    let buttons;
    if (this.props.buttons) {
      buttons = this.props.buttons.map(button => {
        return (
          <KButton key={button.label} style={styles.button} onClick={button.onClick}>{button.label}</KButton>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          {this.props.title}
        </div>
        <div style={styles.content}>
          {this.props.children}
        </div>
        <div style={styles.buttonRow}>
          {buttons}
        </div>
      </div>
    );
  }
}

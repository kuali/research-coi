import React from 'react/addons';
import {merge} from '../../merge';
import ConfigActions from '../../actions/ConfigActions';

export default class SaveButton extends React.Component {
  constructor() {
    super();

    this.save = this.save.bind(this);
  }

  save() {
    ConfigActions.saveAll();
  }

  render() {
    let styles = {
      container: {
        cursor: 'pointer'
      },
      saveIcon: {
        fontSize: 28,
        color: '#EC6F41',
        verticalAlign: 'middle'
      },
      saveText: {
        verticalAlign: 'middle',
        paddingLeft: 10,
        fontSize: 17,
        color: '#525252',
        paddingTop: 3
      }
    };

    return (
      <div className="flexbox row" onClick={this.save} style={merge(styles.container, this.props.style)}>
        <span>
          <i className="fa fa-check" style={styles.saveIcon}></i>
        </span>
        <span className="fill" style={styles.saveText}>SAVE CHANGES</span>
      </div>
    );
  }
}

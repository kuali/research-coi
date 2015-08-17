import React from 'react/addons';
import {merge} from '../../../merge';
import Router from 'react-router';
let Link = Router.Link;

export class BackToDashBoardButton extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: '#444',
        fontWeight: '300',
        borderBottom: '1px solid #c0c0c0',
        borderTop: '1px solid #c0c0c0'
      },
      primary: {
        fontSize: 28,
        fontWeight: 300
      },
      secondary: {
        fontSize: 22,
        fontWeight: 'bold'
      }
    };
    styles = merge(this.commonStyles, styles);

    return (
      <Link to="dashboard" style={merge(styles.container, this.props.style)}>
        <div>
          <span>
            <div style={styles.primary}>Back</div>
            <div style={styles.secondary}>To Dashboard</div>
          </span>
        </div>
      </Link>
    );
  }
}

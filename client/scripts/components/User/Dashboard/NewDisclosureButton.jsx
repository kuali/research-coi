import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import Router from 'react-router';
let Link = Router.Link;
import {PlusIcon} from '../../DynamicIcons/PlusIcon';

export class NewDisclosureButton extends ResponsiveComponent {
  renderMobile() {
    let styles = {
      container: {
        display: 'inline-block',
        backgroundColor: '#2e2e2e',
        verticalAlign: 'top',
        padding: 5,
        cursor: 'pointer',
        color: 'white',
        fontWeight: '300',
        borderRight: '1px solid white',
        fontSize: 11,
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '20%'
      },
      icon: {
        color: 'white',
        width: 45,
        height: 45
      }
    };

    return (
      <Link to="disclosure" query={{type: this.props['type']}} style={merge(styles.container, this.props.style)}>
        <div>
          <PlusIcon style={styles.icon} />
          <div>
            {this.props['type']}
          </div>
          <div>
            Disclosure
          </div>
        </div>
      </Link>
    );
  }

  renderDesktop() {
    let styles = {
      container: {
        display: 'block',
        backgroundColor: window.config.colors.three,
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '300',
        marginBottom: 5
      },
      primary: {
        fontSize: 25
      },
      secondary: {
        fontSize: 22
      }
    };

    return (
      <Link to="disclosure" query={{type: this.props['type']}} style={merge(styles.container, this.props.style)}>
        <div>
          <span>
            <div style={styles.primary}>{this.props.type === 'Annual' ? 'Update' : 'New'}</div>
            <div style={styles.secondary}>{this.props['type']} Disclosure</div>
          </span>
        </div>
      </Link>
    );
  }  
}
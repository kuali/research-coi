import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;
import {KualiLogo} from './DynamicIcons/KualiLogo';
import {HamburgerIcon} from './DynamicIcons/HamburgerIcon';
import {createRequest} from '../HttpUtils';
import Cookies from 'cookies-js';

export class AppHeader extends ResponsiveComponent {
  constructor() {
    super();

    this.state = {
      usersName: ''
    };

    this.commonStyles = {
      logo: {
        width: 26,
        height: 26,
        verticalAlign: 'middle',
        color: 'black'
      },
      kuali: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginTop: '-3px'
      },
      product: {
        color: 'black',
        fontSize: 20,
        fontWeight: '300',
        verticalAlign: 'middle',
        paddingLeft: 5,
        paddingRight: 18,
        borderRight: '1px solid',
        marginRight: 15
      },
      modulename: {
        color: 'black',
        fontSize: 16,
        fontWeight: '300',
        paddingLeft: 5,
        paddingTop: 7
      },
      searchIcon: {
        width: '28px',
        verticalAlign: 'middle',
        padding: '0 10px',
        cursor: 'pointer'
      },
      controls: {
        'float': 'right',
        display: 'inline-block',
        padding: 12,
        fontSize: 13,
        color: '#808080'
      },
      icon: {
        color: '#676767',
        width: '65px',
        verticalAlign: 'middle',
        padding: '0 10px'
      },
      mobileMenu: {
        color: 'white',
        height: '100%'
      }
    };
  }

  componentWillMount() {
    createRequest().get('/api/coi/username')
    .end((err, username) => {
      if (!err) {
        this.setState({
          usersName: username.text
        });
      }
    });
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        backgroundColor: '#202020',
        padding: '0 10px 0 6px'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <header style={merge(styles.container, this.props.style)}>
        <span style={{margin: '6px 0', display: 'inline-block'}}>
          <KualiLogo style={styles.logo} />
          <span style={styles.kuali}>
            <div style={styles.product}>Kuali<span style={{fontWeight: 'bold'}}>Research</span></div>
            <div style={styles.modulename}>CONFLICT OF INTEREST</div>
          </span>
        </span>
        <span style={styles.controls}>
          <HamburgerIcon style={styles.mobileMenu} />
        </span>
      </header>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: 'white',
        padding: '0 10px 0 50px'
      },
      usersName: {
        textTransform: 'uppercase',
        paddingLeft: 20,
        verticalAlign: 'middle'
      },
      signOut: {
        borderRight: '1px solid #555555',
        padding: '0px 20px',
        verticalAlign: 'middle',
        cursor: 'pointer',
        color: '#555555'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <header style={merge(styles.container, this.props.style)}>
        <span style={{margin: '6px 0', display: 'inline-block'}}>
          <Link to={this.props.homelink}>
            <KualiLogo style={styles.logo} />
            <span style={styles.product}>
              Kuali
              <span style={{fontWeight: 'bold'}}>Research</span>
            </span>
          </Link>
          <span style={styles.kuali}>
            <div style={styles.modulename}>Conflict Of Interest</div>
          </span>
        </span>
        <span style={styles.controls}>
          {/*<span style={{verticalAlign: 'middle'}}>
            CONTRAST MODE
          </span>*/}
          <a style={styles.signOut} href="/auth/signout?return_to=/coi">
            <i className="fa fa-sign-out" style={{paddingRight: 5, fontSize: 16}}></i>
            SIGN OUT
          </a>
          <span style={styles.usersName}>Welcome, {this.state.usersName}</span>
        </span>
      </header>
    );
  }
}

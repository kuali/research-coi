import React from 'react/addons';
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;
import {KualiLogo} from './DynamicIcons/KualiLogo';
import {ActionListIcon} from './DynamicIcons/ActionListIcon';
import {HomeIcon} from './DynamicIcons/HomeIcon';
import {ProfileIcon} from './DynamicIcons/ProfileIcon';
import {HeaderButton} from './HeaderButton';
import {HamburgerIcon} from './DynamicIcons/HamburgerIcon';

export class AppHeader extends ResponsiveComponent {
  render() {
    let styles = {
      container: {
        backgroundColor: '#202020',
        padding: window.size === 'SMALL' ? '0 10px 0 6px' : '0 10px 0 50px'
      }, 
      logo: {
        width: 37,
        height: 26,
        verticalAlign: 'middle',
        color: 'white'
      },
      kuali: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginTop: '-3px'
      },
      product: {
        color: 'white',
        fontSize: 20,
        fontWeight: '300',
        verticalAlign: 'middle',
        paddingLeft: 5
      },
      modulename: {
        color: 'white',
        fontSize: 8,
        fontWeight: '300',
        verticalAlign: 'middle',
        paddingLeft: 5,
      },
      searchIcon: {
        width: '28px',
        verticalAlign: 'middle',
        padding: '0 10px',
        cursor: 'pointer'
      },
      controls: {
        'float': 'right',
        cursor: 'pointer',
        display: 'inline-block',
        height: 42
      },
      icon: {
        color: window.config.colors.one,
        width: '65px',
        verticalAlign: 'middle',
        padding: '0 10px'
      },
      mobileMenu: {
        color: 'white',
        height: '100%'
      }
    };

    let menu;
    if (window.size === 'SMALL') {
      menu = (
        <HamburgerIcon style={styles.mobileMenu} />
      );
    }
    else {
      menu = (
        <span>
          <Link to={this.props.homelink}>
            <HeaderButton icon={HomeIcon} label="HOME" />
          </Link>
          <HeaderButton icon={ActionListIcon} label="ACTION LIST" />
          <HeaderButton icon={ProfileIcon} label="ACCOUNT" />
        </span>
      );
    }

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
          {menu}
        </span>
      </header>
    );
  }
}
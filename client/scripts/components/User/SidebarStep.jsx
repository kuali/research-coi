import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {FutureStepIcon} from '../DynamicIcons/FutureStepIcon';
import {CurrentStepIcon} from '../DynamicIcons/CurrentStepIcon';
import {CompletedStepIcon} from '../DynamicIcons/CompletedStepIcon';

export class SidebarStep extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      container: {
        padding: '3px 0 3px 10px',
        fontSize: 18,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      },
      image: {
        width: 42,
        height: 42,
        verticalAlign: 'middle',
        color: '#c1c1c1'
      }
    }
  }

  renderMobile() {
    let mobileStyles = {
      selected: {
        fontWeight: 'bold',
        backgroundColor: '#262626',
        position: 'relative'
      },
      incomplete: {
        color: '#C1C1C1'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let correctStyle;
    let image;

    if (this.props.state && this.props.state.toLowerCase() === 'complete') {
      image = <CompletedStepIcon style={styles.image} />;
      correctStyle = styles.container;
    }
    else if (this.props.state && this.props.state.toLowerCase() === 'active') {
      image = <CurrentStepIcon style={styles.image} />;
      correctStyle = merge(styles.container, styles.selected);
    }
    else {
      image = <FutureStepIcon style={styles.image} />;
      correctStyle = merge(styles.container, styles.incomplete);
    }

    let li = (
      <li style={correctStyle}>
        {image}
        <span style={{verticalAlign: 'middle', paddingLeft: 8}}>{this.props.label}</span>
      </li>
    );

    let returnvalue = null;
    if (this.props.complete || this.props.current) {
      returnvalue = (
        <div onClick={this.navigate}>
          {li}
        </div>
      );
    }
    else {
      returnvalue = li;
    }

    return returnvalue;
  }

  renderDesktop() {
    let desktopStyles = {
      arrow: {
        display: 'inline-block',
        height: 0,
        width: 0,
        border: '10px solid transparent',
        borderLeft: '18px solid #ececec',
        borderBottom: '22px solid transparent',
        borderTop: '22px solid transparent',
        position: 'absolute',
        right: '-27px',
        top: 0,
        zIndex: '99'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: '#262626',
        position: 'relative',
        color: 'black',
        boxShadow: '0 0 8px #CDCDCD'
      },
      clickable: {
        cursor: 'pointer'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>sbs -des
      </span>
    );  
  }
}
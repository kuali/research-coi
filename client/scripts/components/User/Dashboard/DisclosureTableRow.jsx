import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import Router from 'react-router';
import {formatDate} from '../../../formatDate';
let Link = Router.Link;

export class DisclosureTableRow extends ResponsiveComponent {
  constructor() {
    super();

    this.commonStyles = {
    };

    this.state = {
      expanded: false
    };

    this.touch = this.touch.bind(this);
  }

  touch() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        fontSize: 13,
        borderBottom: '5px solid #D7D7D7',
        backgroundColor: 'white',
        transform: this.state.expanded ? 'translateX(-30%)' : 'translateX(0%)',
        whiteSpace: 'nowrap',
        transition: 'transform .2s ease-in',
        height: '105px'
      },
      disclosureRow: {
        display: 'inline-flex',
        flexDirection: 'row',
        padding: '10px 20px',
        width: '100%'
      },
      detailsButton: {
        width: '30%',
        display: 'inline-block',
        backgroundColor: window.config.colors.two,
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
        height: '100%',
        verticalAlign: 'top',
        padding: '38px 3px 0 3px'
      },
      data: {
        display: 'inline-block',
        width: '75%',
        lineHeight: '20px',
        verticalAlign: 'middle'
      },
      type: {
        fontWeight: 'bold',
        fontSize: 16
      },
      buttons: {
        display: 'inline-block',
        width: 50,
        verticalAlign: 'middle'
      },
      button: {
        fontSize: 45,
        border: 0,
        backgroundColor: 'transparent'
      },
      label: {
        fontWeight: '300'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let extraInfo;
    if (this.props.type === 'Annual') {
      extraInfo = (
        <div style={styles.extra}>
          <span style={styles.label}>Expires On: </span>
          {this.props.expiresOn}
        </div>
      );
    }
    else {
      extraInfo = (
        <div style={styles.extra}>
          <span style={styles.label}>Event Title: </span>
          {this.props.title}
        </div>
      );
    }
    
    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.disclosureRow} onClick={this.touch}>
          <span className="fill" style={styles.data}>
            <div style={styles.type}>
              {this.props.type} Disclosure
            </div>
            {extraInfo}
            <div style={styles.status}>
              {this.props.status}
            </div>
            <div style={styles.reviewDate}>
              <span style={styles.label}>Last Reviewed: </span>
              {this.props.lastreviewed}
            </div>
          </span>
          <span style={styles.buttons}>
            <button style={styles.button}>&gt;</button>
          </span>
        </span>
        <span style={styles.detailsButton}>
          VIEW DETAILS
        </span>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '20px 60px',
        borderBottom: '5px solid white',
        backgroundColor: this.props.type === 'Annual' ? '#E9E9E9' : '#F7F7F7'
      },
      cell: {
        display: 'inline-block',
        verticalAlign: 'middle'
      },
      one: {
        width: '35%'
      },
      two: {
        width: '25%',
        color: window.config.colors.two,
        fontSize: 18
      },
      three: {
        width: '25%',
        color: window.config.colors.two,
        fontSize: 18
      },
      four: {
        width: '15%'
      },
      type: {
        color: window.config.colors.two,
        fontSize: 17
      },
      extra: {
        color: window.config.colors.two,
        fontSize: 14
      },
      button: {
        color: 'black',
        fontSize: 12
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let extraInfo;
    if (this.props.type === 'Annual') {
      extraInfo = (
        <div style={styles.extra}>Expires On: {formatDate(this.props.expiresOn)}</div>
      );
    }
    else {
      extraInfo = (
        <div style={styles.extra}>Event Title: {this.props.title}</div>
      );
    }
    
    return (
      <div role="row" style={merge(styles.container, this.props.style)}>
        <span role="gridcell" style={merge(styles.cell, styles.one)}>
          <div style={styles.type}>{this.props.type} Disclosure</div>
          {extraInfo}
        </span>
        <span role="gridcell" style={merge(styles.cell, styles.two)}>
          {this.props.status}
        </span>
        <span role="gridcell" style={merge(styles.cell, styles.three)}>
          {formatDate(this.props.lastreviewed)}
        </span>
        <span role="gridcell" style={merge(styles.cell, styles.four)}>

          <Link to="disclosure" query={{type: this.props.type }}>
            <KButton style={styles.button}>Update &gt;</KButton>
          </Link>
        </span>
      </div>
    );
  }
}
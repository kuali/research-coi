import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {DisclosureActions} from '../../actions/DisclosureActions';
import {KButton} from '../KButton';

export class Instructions extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.close = this.close.bind(this);
  }

  componentWillMount() {
    this.setState({
      visible: !this.props.collapsed
    });
  }

  close() {
    DisclosureActions.toggleInstructions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed && !this.props.collapsed) {
      setTimeout(() => {
        this.setState({
          visible: false
        });
      }, 300);
    }
    else if (!nextProps.collapsed && this.props.collapsed) {
      this.setState({
        visible: true
      });

      nextProps.collapsed = true;

      setTimeout(() => {
        this.props.collapsed = false;
        this.forceUpdate();
      }, 20);
    }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: this.state.visible ? 'block' : 'none',
        color: 'white',
        whiteSpace: 'normal',
        backgroundColor: '#444',
        padding: '47px 25px 31px 53px',
        transition: 'transform .3s ease-out',
        transform: this.props.collapsed ? 'translateY(-100%)' : 'translateY(0%)'
      },
      buttons: {
        textAlign: 'right',
        padding: '14px 14px 0 0'
      },
      closeButton: {
        color: '#1481A3',
        padding: '3px 16px',
        fontSize: 15,
        marginRight: 23
      },
      arrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '25px solid transparent',
        borderTopColor: window.config.colors.four,
        top: 0,
        right: 25
      }
    };

    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.arrow}></div>
        <div>{this.props.text}</div>
        <div style={styles.buttons}>
          <KButton style={styles.closeButton} onClick={this.close}>CLOSE</KButton>
        </div>
      </div>
    );
  }
}

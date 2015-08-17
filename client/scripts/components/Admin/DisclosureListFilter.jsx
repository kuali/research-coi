import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';

export class DisclosureListFilter extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      active: false
    };

    this.click = this.click.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  click() {
    this.setState({active: !this.state.active});
  }

  handleClickOutside() {
    this.setState({active: false});
  }

  componentDidMount() {
    let localNode = React.findDOMNode(this.refs.root);
    let eventHandler = this.handleClickOutside;
    var fn = (evt) => {
      var source = evt.target;

      while(source.parentNode) {
        if (source === localNode) {
          return;
        }
        source = source.parentNode;
      }
      eventHandler(evt);
    };

    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);

    this.clickListener = fn;
  }

  componentWillUnmount() {
    if(this.clickListener) {
      document.removeEventListener('mousedown', this.clickListener);
      document.removeEventListener('touchstart', this.clickListener);
    }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        cursor: 'pointer'
      },
      popOut: {
        position: 'absolute',
        top: 0,
        left: '100%',
        backgroundColor: '#eeeeee',
        padding: 10,
        zIndex: 1,
        display: this.state.active ? 'block' : 'none',
        border: '1px solid #999',
        boxShadow: '4px 2px 10px #eee'
      },
      arrows: {
        fontSize: 7,
        marginLeft: 4,
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={{position: 'relative'}}>
        <div style={merge(styles.container, this.props.style)} onClick={this.click}>
          {this.props.label}
          <span style={styles.arrows}>&#9654;</span>
        </div>
        <div ref="root" style={styles.popOut}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

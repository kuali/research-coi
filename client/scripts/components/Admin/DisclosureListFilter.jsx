import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {AdminActions} from '../../actions/AdminActions';

export class DisclosureListFilter extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      showing: false
    };

    this.click = this.click.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear(e) {
    switch(this.props.children.type.name) {
      case 'DisclosureFilterByDate':
        AdminActions.clearDateFilter();
        break;
      case 'DisclosureFilterByType':
        AdminActions.clearTypeFilter();
        break;
      case 'DisclosureFilterByStatus':
        AdminActions.clearStatusFilter();
        break;
    }
    e.stopPropagation();
  }

  click() {
    this.setState({showing: !this.state.showing});
  }

  handleClickOutside() {
    this.setState({showing: false});
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
        display: this.state.showing ? 'block' : 'none',
        border: '1px solid #999',
        boxShadow: '4px 2px 10px #eee'
      },
      arrows: {
        fontSize: 7,
        marginLeft: 4,
        verticalAlign: 'middle',
        color: 'white'
      },
      clear: {
        display: 'inline-block',
        width: 40,
        fontWeight: 'bold',
        verticalAlign: 'middle',
        color: 'white'
      },
      label: {
        verticalAlign: 'middle',
        color: 'white'
      },
      filter: {
        padding: '0 22px 0 42px',
        position: 'relative',
        backgroundColor: this.props.active ? '#3B7182' : 'initial'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let clearButton;
    if (this.props.active) {
      clearButton = (
        <span onClick={this.clear} style={styles.clear}>X</span>
      );
    }
    else {
      clearButton = (
        <span style={styles.clear}></span>
      );
    }

    return (
      <div style={styles.filter}>
        <div style={merge(styles.container, this.props.style)} onClick={this.click}>
          <span style={styles.label}>{this.props.label}</span>
          <span style={styles.arrows}>&#9654;</span>
          {clearButton}
        </div>
        <div ref="root" style={styles.popOut}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

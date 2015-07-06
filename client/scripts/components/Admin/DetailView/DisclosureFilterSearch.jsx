import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {SearchIcon} from '../../DynamicIcons/SearchIcon';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureFilterSearch extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  onChange(evt) {
    AdminActions.changeQuery(evt.target.value);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        width: '100%',
        backgroundColor : window.config.colors.one,
        padding: '13px 10px',
        textAlign: 'center',
      },
      input: {
        border: 0,
        padding: '2px 0 1px 2px',
        backgroundColor: 'white',
        outline: 0,
        height: 25
      },
      magnifyingGlass: {
        width: 25,
        height: 25,
        color: 'white',
        backgroundColor: '#414141',
        paddingTop: 6,
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let currentValue = this.props.query || '';
    return (
      <div style={merge(styles.container, this.props.styles)}>
        <SearchIcon style={styles.magnifyingGlass} />
        <input placeholder="Search" style={styles.input} type="text" onChange={this.onChange} value={currentValue} />
      </div>
    );
  }
}
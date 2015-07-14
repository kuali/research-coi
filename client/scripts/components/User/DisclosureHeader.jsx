import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {RightArrowIcon} from '../DynamicIcons/RightArrowIcon';
import {InstructionIcon} from '../DynamicIcons/InstructionIcon';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class DisclosureHeader extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  showInstructions() {
    DisclosureActions.toggleInstructions();
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        position: 'relative', 
        textAlign: 'center', 
        padding: 8
      },
      headerIcon: {
        position: 'absolute',
        height: 29,
        width: 29,
        color: '#2E2E2E',
        top: 7
      },
      stepName: {
        fontSize: 21,
        fontWeight: 300
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <header style={merge(styles.container, this.props.style)}>
        <RightArrowIcon style={merge(styles.headerIcon, {left: 10})} />
        <span style={styles.stepName}>{this.props.children}</span>
        <InstructionIcon onClick={this.showInstructions} style={merge(styles.headerIcon, {right: 10})} />
      </header>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        borderBottom: '1px solid #e3e3e3'        
      },
      instructionButton: {
        top: 0,
        position: 'absolute',
        right: '25%',
        backgroundColor: window.config.colors.four,
        color: 'black',
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 0,
        padding: '29px 14px',
        height: '100%'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        'textTransform': 'uppercase',
        fontWeight: 300,
        color: window.config.colors.one
      }      
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.instructionButton} onClick={this.showInstructions}>Instructions</span>
        <h2 style={styles.heading}>
          {this.props.children}
        </h2>
      </div>      
    );  
  }
}
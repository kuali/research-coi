import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ManualEventEntry} from './ManualEventEntry';
import {ManualEventRelations} from './ManualEventRelations';
import {Instructions} from '../Instructions';
import {COIConstants} from '../../../../../COIConstants';

export class ManualEvent extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.isDeclarationOpen = this.isDeclarationOpen.bind(this);
  }

  shouldComponentUpdate() {return true;}

  isDeclarationOpen(id) {
    if (this.props.declarationStates && this.props.declarationStates.manual) {
      let state = this.props.declarationStates.manual[id];
      return (state && state.open);
    }
    else {
      return false;
    }
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        overflow: 'hidden'
      },
      content: {
        padding: '46px 0 0 50px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let screen;
    if (this.props.step === 3) {
      screen = (
        <ManualEventRelations
          disclosure={this.props.disclosure}
          entities={this.props.entities}
          relations={this.props.relations}
          open={this.isDeclarationOpen(this.props.disclosure.id)}
        />
      );
    }
    else {
      screen = (
        <ManualEventEntry
          step={this.props.step}
          disclosure={this.props.disclosure}
          selected={this.props.type}
        />
      );
    }

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.MANUAL];
    let instructions = (
      <Instructions 
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );    

    return (
      <div style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.content}>
          {screen}
        </div>
      </div>
    );
  }
}
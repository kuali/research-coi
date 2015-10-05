import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {COIConstants} from '../../../../../COIConstants';
import {Instructions} from '../Instructions';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {FileUpload} from '../../FileUpload';

export class Certify extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.certify = this.certify.bind(this);
    this.addDisclosureAttachment = this.addDisclosureAttachment.bind(this);
    this.deleteDisclosureAttachment = this.deleteDisclosureAttachment.bind(this);
  }

  addDisclosureAttachment(files) {
    DisclosureActions.addDisclosureAttachment(files);
  }

  deleteDisclosureAttachment(index) {
    DisclosureActions.deleteDisclosureAttachment(index);
  }

  certify(evt) {
    DisclosureActions.certify(evt.target.checked);
  }

  shouldComponentUpdate() { return true; }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        overflow: 'hidden'
      },
      content: {
        display: 'inline-block',
        padding: '46px 0 0 50px'
      },
      p: {
        fontSize: '16px'
      },
      ul: {
        fontSize: '16px'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let instructionText = window.config.general.instructions[COIConstants.INSTRUCTION_STEP.CERTIFICATION];
    let instructions = (
      <Instructions
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    let agreement;

    if (window.config.general.certificationOptions.required) {
      agreement = (
      <div style={{marginTop: 20}}>
          <span style={{display: 'inline-block', width: '5%'}}>
            <input type="checkbox" onChange={this.certify} checked={this.props.isCertified}/>
          </span>
          <span style={{display: 'inline-block', width: '95%', verticalAlign: 'top', fontWeight: 'bold'}}>
            I acknowledge that it is my responsibility to disclose any new SIGNIFICANT FINANCIAL
            INTERESTS obtained during the term of this disclosure. I certify that this is a complete
            disclosure of all my financial interests related to the projects therein.
          </span>
      </div>
      );
    }
    return (
      <div style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.content}>
          <span style={{display: 'inline-block'}}>
            {window.config.general.certificationOptions.text.split('\n').map(function(item) {
              return (
                <span>
                  {item}
                  <br/>
                </span>
              );
            })}
            <FileUpload
            onDrop={this.addDisclosureAttachment}
            delete={this.deleteDisclosureAttachment}
            files={this.props.files}>
              <p>Drag and Drop or Click to upload your attachments</p>
              <p>Acceptable Formats: .pdf, .png, .doc, .jpeg</p>
            </FileUpload>
            {agreement}
          </span>
        </div>
      </div>
    );
  }
}

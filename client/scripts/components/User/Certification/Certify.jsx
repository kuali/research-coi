import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {COIConstants} from '../../../../../COIConstants';
import {Instructions} from '../Instructions';

export class Certify extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  shouldComponentUpdate() {return true;}

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

    let instructionText = window.config.instructions[COIConstants.DISCLOSURE_STEP.CERTIFY];
    let instructions = (
      <Instructions 
        style={{marginBottom: 0}} 
        text={instructionText}
        collapsed={!this.props.instructionsShowing}
      />
    );

    return (
      <div style={merge(styles.container, this.props.style)}>
        {instructions}

        <div style={styles.content}>
          <span style={{display: 'inline-block'}}>
            <p style={styles.p}>In accordance with the Universitys policy on Disclosure of Financial Interests and Management of Conflict of Interest Related to Sponsored Projects, the Principal Investigator and all other Investigators who share responsibility for the design, conduct, or reporting of sponsored projects must disclose their personal SIGNIFICANT FINANCIAL INTERESTS in any non-profit foundation or for-profit company that might benefit from the predictable results of those proposed projects.</p>

            <p style={styles.p}>In addition, when the work to be performed under the proposed research project and the results of the proposed research project would reasonably appear to affect the Investigators SIGNIFICANT FINANCIAL INTEREST, the interest is regarded as being related to the proposed research project and must be reported.</p>

            <p style={styles.p}>For the purposes of this disclosure, SIGNIFICANT FINANCIAL INTEREST is considered to include:</p>

            <ul style={styles.ul}>
              <li>Income (Includes salary, stock dividends and/or interest earned, consulting fees, royalty payments and honoraria from a single business entity exceeding $10,000).</li>
              <li>Position with a single business entity (Includes director, employee, founder, manager, officer, partner, trustee, or advisory board member).</li>
              <li>Investment Ownership or Controlling Interest of more than 5% of the voting stock in a single business entity.</li>
              <li>Interest in Intellectual Property Rights belonging to a single business entity (Includes patents, copyrights or other license rights).</li>
            </ul>

            <div>
              <span style={{display: 'inline-block', width: '5%'}}>
                <input type="checkbox" />
              </span>
              <span style={{display: 'inline-block', width: '95%', verticalAlign: 'top', fontWeight: 'bold'}}>
                I acknowledge that it is my responsibility to disclose any new SIGNIFICANT FINANCIAL
                INTERESTS obtained during the term of this disclosure. I certify that this is a complete
                disclosure of all my financial interests related to the projects therein.
              </span>
            </div>
          </span>
        </div>
      </div>
    );
  }
}
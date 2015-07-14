import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class Question extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.answer = this.answer.bind(this);
  }

  answer(evt) {
    DisclosureActions.answerQuestion({id: this.props.id, answer: evt.target.value});
    DisclosureActions.advanceQuestion();
  }
  
  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'inline-block',
        padding: 1
      },
      option: {
        display: 'inline-block',
        marginRight: 30
      },
      counter: {
        'float': 'right',
        fontSize: 17,
        marginTop: 30
      },
      controls: {
        marginTop: 20
      },
      radio: {
        width: 22,
        height: '4em'
      },
      nums: {
        fontSize: 38,
        marginLeft: 10,
        color: window.config.colors.one
      },
      text: {
        fontSize: 20,
        lineHeight: '28px'
      },
      label: {
        cursor: 'pointer'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.text}>
          {this.props.text}
        </div>
        <div style={styles.controls}>
          <span style={styles.option}>
            <div>
              <input 
                id="yesradio" 
                value="yes" 
                onClick={this.answer} 
                type="radio" 
                name="answer" 
                style={styles.radio} />
            </div>
            <label htmlFor="yesradio" style={styles.label}>YES</label>
          </span>
          <span style={styles.option}>
            <div>
              <input 
                id="noradio" 
                value="no" 
                onClick={this.answer} 
                type="radio" 
                name="answer" 
                style={styles.radio} />
            </div>
            <label htmlFor="noradio" style={styles.label}>NO</label>
          </span>
          <span style={styles.counter}>
            QUESTION
            <span style={styles.nums}>
              {this.props.number}/{this.props.of}
            </span>
          </span>
        </div>
      </span>
    );  
  }
}
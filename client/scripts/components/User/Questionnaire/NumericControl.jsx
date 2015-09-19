import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {NextButton} from './NextButton';

export class NumericControl extends React.Component {
  constructor() {
    super();

    this.answer = this.answer.bind(this);
    this.submit = this.submit.bind(this);
  }

  answer(evt) {
    this.props.onChange(evt);
  }

  submit() {
    if (this.props.isValid){
      this.props.onClick();
    }
  }

  render() {
    let styles = {
      container: {
        width: '100%',
        display: 'inline-block'
      },
      textbox: {
        padding: 6,
        fontSize: 16,
        borderRadius: 5,
        border: '1px solid #B0B0B0'
      }
    };

    return (
      <div>
        <div style={styles.container}>
          <input style={styles.textbox} type="number" id="number" onChange={this.answer} value={this.props.answer} />
        </div>
        <NextButton onClick={this.submit} isValid={this.props.isValid}/>
        <div style={{clear: 'both'}}/>
      </div>
    );
  }
}

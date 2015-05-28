import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import merge from '../../merge';

export class KualiLogo extends ResponsiveComponent {
  constructor() {
    super();
    this.props = {
      style: {
        color: 'white'
      }
    };
  }

  render() {
    return (
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 152.3 153.1" enable-background="new 0 0 152.3 153.1">
        <g>
          <path fill-rule="evenodd" clip-rule="evenodd" fill={this.props.style.color} d="M146.7,137c-2.2,6.4-8.3,11-15.5,11H50.9c9.4-16.4,19.1-37.1,23.5-58.5c3.6,10.3,11.8,19.8,20.1,26.3C105.5,124.2,122,132.1,146.7,137L146.7,137z"/>
          <path fill-rule="evenodd" clip-rule="evenodd" fill={this.props.style.color} d="M45.3,5.1h85.9c9,0,16.4,7.4,16.4,16.4v85.6c-15.2-2.3-56.5-11.5-56.3-32.9c0.2-18.5,26.2-24.8,40.5-26.1l-9.6-6.6c0,0-32.7,2.6-45.4,23.2C76.3,42.7,67.8,21.5,45.3,5.1L45.3,5.1z"/>
          <path fill-rule="evenodd" clip-rule="evenodd" fill={this.props.style.color} d="M21.1,5.1H35C56,23.6,93.7,72.6,4.7,128.7c0-0.1,0-0.2,0-0.2V21.5C4.7,12.5,12.1,5.1,21.1,5.1L21.1,5.1z"/>
        </g>
      </svg>
    );
  }
}
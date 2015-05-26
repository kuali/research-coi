import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import merge from '../../merge';

export class HomeIcon extends ResponsiveComponent {
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
      <svg style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 47 44.7" enable-background="new 0 0 47 44.7">
        <polygon fill={this.props.style.color} points="44.1,21 37,21 37,39 29,39 29,30 21,30 21,39 12,39 12,21 5.6,21 24.8,5.6 "/>
      </svg>
    );
  }
}
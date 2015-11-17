/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

/*global TWEEN*/
import React from 'react';
import {merge} from '../../merge';

export class ProgressIndicator extends React.Component {
  constructor(props) {
    super();
    this.percent = {value: isNaN(props.percent) ? 0 : props.percent};
    this.animated = false;
    this.animate = this.animate.bind(this);
    this.animateTo = this.animateTo.bind(this);
    this.paint = this.paint.bind(this);
  }

  componentDidMount() {
    var cnvsElement = this.refs.theCanvas;
    var context = cnvsElement.getContext('2d');
    context.font = '65px Arial';

    this.canvasContext = context;

    this.paint();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.percent !== nextProps.percent) {
      this.animateTo(nextProps.percent);
    }
    if (this.props.useColor !== nextProps.useColor) {
      this.paint();
    }
  }

  shouldComponentUpdate() { return false; }

  animate() {
    if (this.animated) {
      requestAnimationFrame(this.animate);
      TWEEN.update();
      this.paint();
    }
  }

  animateTo(newValue) {
    this.animated = true;
    if (this.tween) {
      this.tween.stop(); // Stop any tweens already running
    }
    this.tween = new TWEEN.Tween(this.percent)
      .to({value: newValue}, 750)
      .easing(TWEEN.Easing.Bounce.Out)
      .onComplete(() => {
        this.animated = false;
      })
      .start();
    this.animate();
  }

  paint() {
    let ctx = this.canvasContext;
    ctx.clearRect(0, 0, 200, 200);

    // unfinished arc
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Completed arc
    var radians = (2 * Math.PI * this.percent.value / 100) - (Math.PI / 2);
    ctx.strokeStyle = window.colorBlindModeOn ? 'black' : '#0095A0';
    ctx.beginPath();
    ctx.arc(100, 100, 90, -Math.PI / 2, radians);
    ctx.stroke();

    // the percent text
    ctx.fillStyle = window.colorBlindModeOn ? 'black' : '#666666';
    ctx.lineWidth = 1;
    ctx.fillText(Math.floor(this.percent.value) + '%',
      this.percent.value < 10 ? 60 : 40,
      120
    );
  }

  render() {
    let styles = {
      container: {
        position: 'relative',
        textAlign: 'center',
        width: 120,
        height: 120
      }
    };

    return (
      <canvas style={merge(styles.container, this.props.style)} width="200" height="200" ref="theCanvas">
      </canvas>
    );
  }
}

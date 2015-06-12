import React from 'react/addons';
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
		var cnvsElement = this.refs.theCanvas.getDOMNode();
		var context = cnvsElement.getContext('2d');
		context.font = "65px Arial"

		this.canvasContext = context;

		this.paint();
	}

	componentWillReceiveProps(nextProps) {
    if (this.props.percent !== nextProps.percent) {
			this.animateTo(nextProps.percent);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

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
		ctx.strokeStyle = '#5080A0';
		ctx.lineWidth = 20;
		ctx.beginPath();
		ctx.arc(100, 100, 90, 0, Math.PI * 2);
		ctx.stroke();

		// Completed arc
		var radians = (2 * Math.PI * this.percent.value / 100) - (Math.PI / 2);
		ctx.strokeStyle = '#69A62E';
		ctx.beginPath();
		ctx.arc(100, 100, 90, -Math.PI / 2, radians);
		ctx.stroke();

		// the percent text
		ctx.fillStyle = '#434343';
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

'use strict';

// 引入模块
const React = require('react');
require('../sass/clock.sass');

let ClockCanvas = null;
let Timer = null

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Clock';
        this.state = {
        	mode: 'electrict',
        	hour: 1	,
        	minute: null,
        	second: null,
        	size: '150px'
        };
    }

    componentDidMount() {
        ClockCanvas = require('../lib/clock.js')();
        Timer = setInterval(() => {
            let date = new Date(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            this.setState({
                hour,
                minute,
                second
            });
        }, 1000);
        $('#clock-image').css('width', this.state.size);
        $('#clock-image').css('height', this.state.size);
    }

    render() {
    	let clock = this.getImage();
        return (
        	<div id="clock-wrapper">
                <canvas ref="canvas" id="clock" width={ this.state.size } height={ this.state.size }></canvas>
                { clock }
                <div id="clock-image"></div>
            </div>
        );
    }

    getImage() {
    	if (this.state.mode == 'electrict') {
    		return (
    			<div className="electrict-clock">
                    { this.state.hour } : { this.state.minute } : { this.state.second }
    			</div>
    		)
    	}
    }
}

module.exports = Clock;

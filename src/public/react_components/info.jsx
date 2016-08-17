'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

require('../sass/info.sass');

module.exports = React.createClass({
	render: function() {
	    let info = this.renderInfo();
		return (
			<div className="person-info-wrapper column">
			    <div className="person-info-container">
			        <header className="ui dividing header">Information</header>
			        <div className="person-info">
			            <div className="avatar">
			                <img src="https://www.gravatar.com/avatar/4c5c6071248b020be7f7777d5ae03a35?s=100"></img>
			            </div>
			            <div className="person-info-detail ui list">
			                { info }
			            </div>
			        </div>
			    </div>
			</div>
		);
	},

	renderInfo: function() {
		let info = [];
		console.log(this.props.data);
		for (let key in this.props.data) {
			let value = this.props.data[key];
            info.push(
                <div className="person-info-item item" key={ key }>
                    <div className="key">
                        { key + ':' }
                    </div>
                    <div className="middle aligned content">
                        { value }
                    </div>
                </div>
            );
		};
		return info;
	}
});
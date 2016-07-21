"use strict";
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = React.createClass({
	render: function() {
	    let info = this.renderInfo();
		return (
			<div className="person-info-wrapper column">
			    <header className="ui dividing header">Infomation</header>
			    <div className="person-info-detail ui items">
			        { info }
			    </div>
			</div>
		);
	},

	renderInfo: function() {
		let info = [];
		this.props.data.map((value, key) => {
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
		});
		return info;
	}
});
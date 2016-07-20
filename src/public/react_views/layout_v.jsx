"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
require('../sass/header.sass');
// require('../css/footer.css');

var Header = React.createClass({
	getInitialState: function() {
		return {
			items: [
			    {
			    	name: 'Index',
			    	url: '/',
			    	className: 'index'
			    },
			    {
			    	name: 'Article',
			    	url: '/article',
			    	className: 'article'
			    },
			    {
			    	name: 'Photo',
			    	url: '/photo',
			    	className: 'photo'
			    },
			    {
			    	name: 'Lab',
			    	url: '/lab',
			    	className: 'lab'
			    },
			],

		}
	},

	componentDidMount: function() {
	},

	render: function() {
		let title = 'William\'s website';
		let list = this.renderList();

		return(
			<div className="" id="page-header">
			    <div className="brand">
			        <img className="icon" alt="icon"></img>
			        <span>{ title }</span>
			        <div id="clock-image"></div>
			    </div>
			    <div className="nav-wrapper">
			        <nav className="nav-bar ui pointing secondary menu">
                        { list }
    			        <div className="authorize right menu">
                            {(() => {
                                if (this.state.login) {
                                	return (
                                		<a className="ui item logout">Logout</a>
                                	);
                                } else {
                                	return [(
                                		<a className="ui item login">Login</a>
                                	), (
                                        <a className="ui item register">Register</a>
                                	)];
                                }
                            })()}
    			        </div>
    			    </nav>
			    </div>
			</div>
		)
	},

    renderList: function() {
    	let list = [];
    	this.state.items.map((item, key) => {
    		let className = 'item nav-item ' + item.className;
    		list.push(
    			<a className={ className } href={ item.url } key={ key }>{ item.name }</a>
    		);
    	});
    	return list;
    }
});

var Footer = React.createClass({
	render: function() {
		return (
			<div className="ui basic center aligned segment">
			<a href="#">
			<i className="info icon"/>
			<span>About us</span>
		</a>
		<a href="#">
			<i className="comment icon"/>
			<span>Give us some advice</span>
		</a>
		</div>
		);
	}
});

$(function() {
	ReactDOM.render(<Header />, $("#header")[0], null);
	ReactDOM.render(<Footer />, $("#footer")[0], null);
});
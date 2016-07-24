"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
require('../sass/header.sass');
require('../sass/footer.sass');
require('../sass/base.sass');

let Header = React.createClass({
	getInitialState: function() {
		return {
			items: [
			    {
			    	name: 'Index',
			    	url: '/',
			    	className: 'index',
			    	icon: 'home'
			    },
			    {
			    	name: 'Article',
			    	url: '/article',
			    	className: 'article',
			    	icon: 'book'
			    },
			    {
			    	name: 'Photo',
			    	url: '/photo',
			    	className: 'photo',
			    	icon: 'photo'
			    },
			    {
			    	name: 'Lab',
			    	url: '/lab',
			    	className: 'lab',
			    	icon: 'world'
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
                                		<a className="ui item login" key="1">Login</a>
                                	), (
                                        <a className="ui item register" key="2">Register</a>
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
    		let className = 'item nav-item ' + item.className,
    		    iconClass = 'large ' + item.icon + ' icon'; 
    		list.push(
    			<a className={ className } href={ item.url } key={ key }>
    			    <i className={ iconClass }></i>
    			    { item.name }
    			</a>
    		);
    	});
    	return list;
    }
});

var Footer = React.createClass({

    getInitialState: function() {
    	return {
            links: [
            {
                url: 'https://github.com/williamking',
                icon: 'github',
                text: 'My github',
                name: 'github'
            },
            {
                url: 'mailto:williamjwking@gmail.com',
                icon: 'mail',
                text: 'My email',
                name: 'email'       	
            }
            ]
        };
    },

	render: function() {
		let links = this.renderLinks();
		return (
		<div className="ui basic center aligned segment" id="page-footer">
		    <div id="copy-right">
		        <p>
		            Copyright <i className="copyright icon"></i>2016 William.D.King.
		        </p>
		    </div>
		    <div id="other-link" className="ui horizontal divided list">
                { links }
		    </div>
		</div>
		);
	},

	renderLinks: function() {
		let links = [];
		this.state.links.map((link, key) => {
            links.push(
            <div className="item" key={ key }>
                <i className={ link.icon + ' icon' + ' ui avatar'}></i>
                <div className="content">
                    <a href={ link.url } className={ link.name + '-link' }>
                        <span>{ link.text }</span>
                    </a>
                </div>
            </div>
            );
		});
		return links;
	}
});

$(function() {
	ReactDOM.render(<Header />, $("#header")[0], null);
	ReactDOM.render(<Footer />, $("#footer")[0], null);
});
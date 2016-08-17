"use strict";
const React = require("react");
const ReactDOM = require("react-dom");

require('../sass/header.sass');
require('../sass/footer.sass');
require('../sass/base.sass');

const ModeType = {
	normal: Symbol(),
	login: Symbol(),
	register: Symbol()
};

// 加载模块
const LoginForm = require('../react_components/login_form.jsx');
const RegisterForm = require('../react_components/register_form.jsx');
const Clock = require('../react_components/clock.jsx');

let Header = React.createClass({
	getInitialState: function() {
		return {
			userState: {},
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
            mode: ModeType.normal
		}
	},

	componentWillMount: function() {
        this.getCurrentUser();
	},

	componentDidMount: function() {
        this.checkMask();
	},

	componentDidUpdate: function() {
		this.checkMask();
	},

	render: function() {
		let title = 'William\'s website';
		let list = this.renderList();

		return(
			<div className="" id="page-header">
			    <div className="brand">
			        <div className="title">{ title }</div>
                    <Clock />
			    </div>
			    <div className="nav-wrapper">
			        <nav className="nav-bar ui pointing secondary menu">
                        { list }
    			        <div className="authorize right menu">
                            {(() => {
                                if (this.state.userState.username) {
                                	return [(
                                		<div className="user" key="1">Welcome! { this.state.userState.username }</div>
                                	), (
                                        <a className="ui item logout" key="2" onClick={ this.logout }>Logout</a>
                                	)];
                                } else {
                                	return [(
                                		<a className="ui item login" key="1" onClick={ this.setModeToLogin }>Login</a>
                                	), (
                                        <a className="ui item register" key="2" onClick={ this.setModeToRegister }>Register</a>
                                	)];
                                }
                            })()}
    			        </div>
    			    </nav>	
			    </div>
			    <LoginForm callback = { this.getCurrentUser } show={ this.state.mode == ModeType.login } onCancel={ this.setModeToNormal } />
			    <RegisterForm show={ this.state.mode == ModeType.register } onCancel={ this.setModeToNormal } />
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
    },

    setModeToLogin: function() {
        this.setState({
            mode: ModeType.login
        });
    },

    setModeToRegister: function() {
    	this.setState({
    		mode: ModeType.register
    	});
    },

    setModeToNormal: function() {
    	this.setState({
    		mode: ModeType.normal
    	});
    },

    checkMask: function() {
		if (this.state.mode != ModeType.normal) $('.mask').show();
		else $('.mask').hide();
    },

    // 获取当前登录状态
    getCurrentUser: function() {
	    $.get('/api/get_current_user', (result) => {
	    	this.setState({
                userState: {
                	username: result.username,
                	userId: result.user,
                	userType: result.userType
                }
	    	});
	    });
    },

    logout: function() {
    	let update = this.getCurrentUser;
        $.get('/api/logout', (result) => {
        	if (result.status == 'OK') {
        		alert('登出成功!');
                update();
        	} else {
        		alert(result.msg);
        	}
        })
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
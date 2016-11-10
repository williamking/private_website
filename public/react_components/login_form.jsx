'use strict';

let React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

require('../sass/login_form.sass');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],

    getInitialState: function() {
    	return {
    		username: '',
    		password: ''
    	}
    },

    componentDidMount: function() {
        this.checkState();
    },

    componentDidUpdate: function() {
        if (!this.props.show) $('.login-form-wrapper').hide();
        else $('.login-form-wrapper').show();
    },

    render: function() {
    	return(
    		<div className="login-form-wrapper">
    		    <form className="ui form" id="login-form">
    		        <div className="field">
    		            <label>username</label>
    		            <input type="text" name="username" placeholder="username" valueLink={ this.linkState('username') }/>
    		        </div>
    		        <div className="field">
    		            <label>password</label>
    		            <input type="password" name="password" placeholder="password" valueLink={ this.linkState('password') }/>
    		        </div>
                    <div className="ui blue button submit">Login</div>
                    <div className="ui button" onClick={ this.props.onCancel }>Cancel</div>
                    <div className="ui error message"></div>
    		    </form>
    		</div>
    	);
    },

    checkState: function() {
        let cb = this.login;
        $('#login-form').form({
            fields: {
                username: 'empty',
                password: ['minLength[6]', 'empty']
            },
            onSuccess: (event) => {
                event.preventDefault();
                cb();
                return false;                
            }
        });
        if (!this.props.show) $('.login-form-wrapper').hide();
        else $('.login-form-wrapper').show();
    },

    login: function(event) {
        let cancel = this.props.onCancel;
        let callback = this.props.callback;
        $.post('/api/login', {
            username: this.state.username,
            password: this.state.password
        }, function(result) {
            if (result.status == 'OK') {
                sessionStorage.role = result.data.role;
                alert('登录成功！');
                cancel();
                callback();
            } else {
                alert(result.msg);
            }
        });
    }
});
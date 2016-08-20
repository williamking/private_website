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
        this.checkState();
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
    		            <input type="password" name="passowrd" placeholder="password" valueLink={ this.linkState('password') }/>
    		        </div>
                    <div className="ui blue button" onClick={ this.login }>Login</div>
                    <div className="ui button" onClick={ this.props.onCancel }>Cancel</div>
                    <div className="ui error message"></div>
    		    </form>
    		</div>
    	);
    },

    checkState: function() {
        $('#login-form').form({
            fields: {
                username: 'empty',
                password: ['minlength[6]', 'empty']
            }
        });
        if (!this.props.show) $('.login-form-wrapper').hide();
        else $('.login-form-wrapper').show();
    },

    login: function(event) {
        // debugger;
        event.preventDefault();
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
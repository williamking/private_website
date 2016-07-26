'use strict';

let React = require('react');
require('../sass/login_form.sass');

module.exports = React.createClass({
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
    		            <input type="text" name="username" placeholder="username"/>
    		        </div>
    		        <div className="field">
    		            <label>password</label>
    		            <input type="password" name="passowrd" placeholder="password"/>
    		        </div>
                    <div className="ui blue submit button">Login</div>
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
    }
});
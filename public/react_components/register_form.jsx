'use strict';

let React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

require('../sass/register_form.sass');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],

    getInitialState: function() {
    	return {
    		username: '',
    		password: '',
            confirmPassword: '',
            email: '',
            signature: '',
            qq: '',
            birthday: '',
            hobbies: ''
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
    		<div className="register-form-wrapper">
    		    <form className="ui form" id="register-form" action="/api/login" method="post">
    		        <div className="field">
    		            <label>username</label>
    		            <input type="text" name="username" placeholder="username" valueLink={ this.linkState('username') }/>
    		        </div>
    		        <div className="field">
    		            <label>password</label>
    		            <input type="password" name="password" placeholder="password" valueLink={ this.linkState('password') }/>
    		        </div>
                    <div className="field">
                        <label>Confirm password</label>
                        <input type="password" name="confirm-password" placeholder="confirm password" valueLink={ this.linkState('confirmPassword') }/>
                    </div>
                    <div className="field">
                        <label>email</label>
                        <input type="email" name="email" placeholder="email" valueLink={ this.linkState('email') }/>
                    </div>
                    <div className="field">
                        <label>signature</label>
                        <input type="text" name="signature" placeholder="signature" valueLink={ this.linkState('signature') } />
                    </div>
                    <div className="ui blue button" onClick={ this.checkForm }>Register</div>
                    <div className="ui button" onClick={ this.props.onCancel }>Cancel</div>
                    <div className="ui error message"></div>
    		    </form>
    		</div>
    	);
    },

    checkState: function() {
        $('#register-form').form({
            fields: {
                username: 'empty',
                password: ['minLength[6]', 'empty'],
                "confirm-password": 'match[password]',
                email: 'email'
            },
            onSuccess: this.register
        });
        if (!this.props.show) $('.register-form-wrapper').hide();
        else $('.register-form-wrapper').show();
    },

    checkForm: function(event) {
        event.preventDefault();
        $('#register-form').form('validate form');
    },

    register: function(event) {
        // debugger;
        let cancel = this.props.onCancel;
        $.post('/api/register', {
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            email: this.state.email,
            signature: this.state.signature,
        }, function(result) {
            if (result.status == 'OK') {
                alert('注册成功！');
                cancel();
            } else {
                alert(result.msg);
            }
        });
    }
});
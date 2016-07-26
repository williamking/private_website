'use strict';

// 引入模块
const React = require('react');
const moment = require('moment');

module.exports = React.createClass({
	getInitialState: function() {
	    return {
	        comments: this.props.comments
	    };
	},

	render: function() {
		return (
			<div className="ui comments">
			    { this.renderComments() }
			</div>
		);
	},

	renderComments: function() {
		let comments = [];
        this.state.comments.forEach((comment, key) => {
        	let time = moment(comment.createTime).format('YYYY-MM-YY');
            comments.push(
            	<div className="comment" key={ key }>
            	    <a className="avatar">
            	        <img src={ require('../images/visitor.jpg') } className=".avatar"></img>
            	    </a>
            	    <div className="content">
            	        <a className="author">comment.author</a>
            	        <div className="metadata">
            	            <span className="date">Commented at { time }</span>
            	        </div>
            	        <div className="text">{ comment.content }</div>
            	        <div className="actions">
            	            <a className="reply">Reply</a>
            	        </div>
            	    </div>
            	</div>
            );
        });
        return comments;
	}
});
'use strict';

// 引入模块
const React = require('react');
const CommentItem = require('./comment_item.jsx'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

require('../sass/comment.sass');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],

	getInitialState: function() {
	    return {
            comments: this.props.comments,
            content: ''
	    };
	},

    componentWillReceiveProps(nextProps) {
        this.setState({
            comments: nextProps.comments
        });
    },

	render() {
		return (
			<div className="ui comments" style={{ 'maxWidth': '100%' }}>
			    { this.renderComments() }
                <form className="ui reply form">
                    <div className="field">
                        <textarea valueLink={ this.linkState('content') }></textarea>
                    </div>
                    <div className="ui primary labled icon button" onClick={ this.addComment }>
                        <i className="icon edit"></i>
                        Comment
                    </div>
                </form>
			</div>
		);
	},

	renderComments() {
		let comments = [];

        this.state.comments.forEach((comment, key) => {
            comments.push(
                <CommentItem index={ key } articleId={ this.props.id } comment={ comment } key={ key } handleCommentUpdate={ this.props.handleCommentUpdate }/>
            );
        });
        return comments;
	},

    addComment(e) {
        e.preventDefault();
        $.post('/api/articles/' + this.props.id + '/comments', {
            content: this.state.content
        }, (result) => {
            if (result.status == 'OK') {
                alert('评论成功');
                let comments = this.state.comments;
                comments.unshift(result.data);
                this.setState({
                    comments,
                    content: ''
                });
            } else {
                alert(result.msg);
            }
        });
    }

});
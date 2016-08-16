'use strict';

// 引入模块
const React = require('react');
const moment = require('moment'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

module.exports = React.createClass({
    mixins: [LinkedStateMixin],

  	getInitialState() {
  	    return {
  	        comment: this.props.comment,
  	        reply: false,
            content: ''
  	    };
  	},

	  render() {
		    let comment = this.state.comment;
        let commentTime = moment(comment.commentAt).format('YYYY-MM-YY h:mm:ss');
        let replyTime = moment(comment.repliedAt).format('YYYY-MM-YY h:mm:ss');
        let replyBlock = (() => {
            if (comment.reply) {
                return (
                    <div className="comments">
                        <a className="avatar">
                            <img src={ require('../images/visitor.jpg') } className="avatar"></img>
                        </a>
                        <div className="content">
                            <a className="author">William</a>
                            <div className="metadata">
                                <span>Replied at </span>
                                <span className="date">{ replyTime }</span>
                            </div>
                            <div className="text">{ comment.reply }</div>
                        </div>
                    </div>
                );
            } else {
                return;
            }
        })();
        let replyEditor = (() => {
        	if (this.state.reply) {
        		return (
                    <form className="ui reply form">
                        <div className="field">
                            <textarea valueLink={ this.linkState('content') }></textarea>
                        </div>
                        <div className="ui primary labled icon button" onClick={ this.reply }>
                            <i className="icon edit"></i>
                            Reply
                        </div>
                    </form>
        		);
        	} else {
        		return;
        	}
        })();
        return (
           	<div className="comment">
               	    <a className="avatar">
               	        <img src={ require('../images/visitor.jpg') } className=".avatar"></img>
               	    </a>
               	    <div className="content">
               	        <a className="author">{ comment.commentor }</a>
               	        <div className="metadata">
               	            <span className="date">Commented at { commentTime }</span>
               	        </div>
               	        <div className="text">{ comment.content }</div>
               	        <div className="actions">
               	            <a className="reply" onClick={ this.toggleReply }>Reply</a>
               	        </div>
               	    </div>
                    { replyBlock }
                    { replyEditor }
                    <div className="ui dividing header"></div>
           	</div>
        );
	  },

  	toggleReply() {
  		this.setState({
  			reply: !this.state.reply
  		});
  	},
  
    reply() {
      let id = this.state.comment._id;
      $.post('/api/articles/' + this.props.articleId + '/comments/' + id, {
          content: this.state.content
      }, (result) => {
          if (result.status == 'OK') {
            alert('回复成功');
            this.props.handleCommentUpdate(this.props.index, result.data);
          } else alert(result.msg);
      });
    }
});

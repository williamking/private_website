'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom');
const marked = require('marked');

//导入模块
const Comment = require('../react_components/comment.jsx');
const UrlParser = require('../lib/url.js');

// css导入
require('../sass/article_content.sass');

const ArticleContent = React.createClass({
	getInitialState: function() {
		let urlParser = new UrlParser(window.location.href);
		return {
            articleText: 'This article is empty now.',
            title: 'Loading......',
            path: urlParser.query.path,
            comments: [{
            	author: '赵日天',
            	content: '我赵日天不服',
            	createTime: new Date()
            },
            {
            	author: '赵日天',
            	content: '我赵日天不服',
            	createTime: new Date()
            }]
        }
	},

	componentDidMount: function() {
		if (!this.state.path) return;
		let url = '/api/article/file?path=' + this.state.path;
		$.get(url, ((result) => {
			if (result.status == 'OK') {
                this.setState({
             	    articleText: marked(result.data.content),
             	    title: result.data.title
                });
            }
		}).bind(this));
	},

	render: function() {
		return (
			<div className="article-content-wrapper">
			    <div className="article-content-container">
                    <article>
                        <header className="ui dividing huge header">
                            { this.state.title }
                        </header>
                        <div className="content" id="article-text" dangerouslySetInnerHTML={{ __html: this.state.articleText }}>
                        </div>
                    </article>
			    </div>
			    <h4 className="ui horizontal divider header">
			        <i className="comment icon"></i>
			        Comments
			    </h4>
			    <Comment comments={ this.state.comments }/>
			</div>
		);
	}
});

$(function() {
	ReactDOM.render(<ArticleContent />, $("#article-content")[0], null);
});
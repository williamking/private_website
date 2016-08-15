'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom');
const marked = require('marked');

//导入模块
const Comment = require('../react_components/comment.jsx');
const UrlParser = require('../lib/url.js');
const moment = require('moment');

// css导入
require('../sass/article_content.sass');

const ArticleContent = React.createClass({
	getInitialState: function() {
		let urlParser = new UrlParser(window.location.href);
		return {
            id: null,
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
            }],
            pv: 0,
            lastEditTime: 'loading......',
            readTimes: 'loading......'
        }
	},

	componentDidMount: function() {
        let url;
		if (this.state.path) {
		    url = '/api/articles/file?path=' + this.state.path;
        } else {
            let id = window.location.href.split('/');
            url = '/api/articles/' + id[id.length - 1];
        }
        $.get(url, (result) => {
            // console.log(result);
            let lastEditTime = moment(result.data.lastEditAt).format('YYYY-MM-DD');
            if (result.status == 'OK') {
                this.setState({
                    id: result.data._id,
                    articleText: marked(result.data.content),
                    title: result.data.title,
                    pv: result.data.pv,
                    lastEditTime,
                    readTimes: result.data.readTimes
                });
            }
        });
	},

	render: function() {
		return (
			<div className="article-content-wrapper">
			    <div className="article-content-container">
                    <article>
                        <header className="ui dividing huge header article-header">
                            <div className="section">
                                <div className="title">{ this.state.title }</div>
                                <div className="article-status">
                                    <div className="ui labeled button">
                                        <div className="ui red button" onClick={ this.admire }>
                                            <i className="thumbs up icon"></i>
                                            Like
                                        </div>
                                        <a className="ui basic red left pointing label">
                                            { this.state.pv }
                                        </a>
                                    </div>
                                    <div className="ui labeled button">
                                        <div className="ui basic blue button">
                                            <i className="user icon"></i>
                                            ReadingTimes
                                        </div>
                                        <a className="ui basic blue left pointing label">
                                            { this.state.readTimes }
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="time">Last edited at  
                                <span>
                                    { ' ' + this.state.lastEditTime }
                                </span>
                            </div>
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
	},

    admire() {
        $.get('/api/articles/' + this.state.id + '/admire', (result) => {
            if (result.status = 'OK') {
                alert('点赞成功');
                this.setState({
                    pv: result.data
                })
            } else {
                alert('服务器菌出了点问题，骚瑞!');
            }
        });
    }
});

$(function() {
	ReactDOM.render(<ArticleContent />, $("#article-content")[0], null);
});
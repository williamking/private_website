'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom');
const marked = require('marked');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const highlight = require('highlightjs');


//导入模块
const Comment = require('../react_components/comment.jsx');
const UrlParser = require('../lib/url.js');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/markdown/markdown');
require('codemirror/lib/codemirror.css');
const moment = require('moment');
const scroll = require('../lib/scroll.js');
const SimpleMde = require('../react_components/simple_mde.jsx');

// css导入
require('../sass/article_content.sass');
require('github-markdown-css');

const ArticleContent = React.createClass({
    mixins: [LinkedStateMixin],

	getInitialState: function() {
		let urlParser = new UrlParser(window.location.href);
		return {
            id: null,
            articleText: 'This article is empty now.',
            title: 'Loading......',
            path: urlParser.query.path,
            // comments: [{
            // 	commentor: '赵日天',
            // 	content: '我赵日天不服',
            // 	commentAt: new Date()
            // },
            // {
            // 	commentor: '赵日天',
            // 	content: '我赵日天不服',
            // 	commentAt: new Date()
            // }],
            comments: [],
            tags: [],
            pv: 0,
            lastEditTime: 'loading......',
            readTimes: 'loading......',
            commentContent: '',
            edit: false,
            editContent: '',
            editTitle: ''
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

        // marked设置
        marked.setOptions({
            highlight: (code) => {
                return highlight.highlightAuto(code).value;
            }
        });

        $.get(url, (result) => {
            let lastEditTime = moment(result.data.lastEditAt).format('YYYY-MM-DD');
            if (result.status == 'OK') {
                this.setState({
                    id: result.data._id,
                    articleText: marked(result.data.content),
                    title: result.data.title,
                    editTitle: result.data.title,
                    pv: result.data.pv,
                    tags: result.data.category,
                    lastEditTime,
                    readTimes: result.data.readTimes,
                    comments: result.data.comments,
                    editContent: result.data.content
                });
            }
        });
	},

	render: function() {
        let tags = this.renderTags();
        let content = this.getArticleContent();
        let editButton = this.getEditButton();
        let title = this.getTitle();
		return (
			<div className="article-content-wrapper">
			    <div className="article-content-container">
                    <article>
                        <header className="ui dividing huge header article-header">
                            <div className="section">
                               { title }
                                <div className="article-status">
                                   { editButton }
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
                            <div className="section">
                                <div className="tags">
                                    <span>tags: </span>
                                    { tags }
                                </div>
                                <div className="time">Last edited at  
                                    <span>
                                        { ' ' + this.state.lastEditTime }
                                    </span>
                                </div>
                            </div>
                        </header>
                        { content }
                    </article>
			    </div>
			    <h4 className="ui horizontal divider header" name="comments" id="comments">
			        <i className="comment icon"></i>
			        Comments
			    </h4>
			    <Comment addComment={ this.addComment } comments={ this.state.comments } id={ this.state.id } handleCommentUpdate={ this.handleCommentUpdate } />
			</div>
		);
	},

    admire() {
        $.get('/api/articles/' + this.state.id + '/admire', (result) => {
            if (result.status = 'OK') {
                alert('点赞成功');
                this.setState({
                    pv: result.data
                });
            } else {
                alert('服务器菌出了点问题，骚瑞!');
            }
        });
    },

    handleCommentUpdate(index, comment) {
        let comments = this.state.comments;
        comments[index] = comment;
        this.setState({
            comments
        });
        // setTimeout(() => {
        //     location.hash='#comments';
        // }, 1000);
    },

    addComment(id, content) {
        $.post('/api/articles/' + id + '/comments', {
            content
        }, (result) => {
            if (result.status == 'OK') {
                alert('评论成功');
                let comments = this.state.comments;
                comments.unshift(result.data);
                this.setState({
                    comments
                });
                scroll('#comments');
            } else {
                alert(result.msg);
            }
        });
    },

    renderTags() {
        let tags = [];
        this.state.tags.forEach((value, index) => {
            tags.push(
                <a className="ui teal tag label" key={ index }>{ value }</a> 
            );
        });
        return tags;
    },

    getArticleContent() {
        if (this.state.edit) {
            return <div className="codemirror-wrapper">
                <div className="codemirror-container">
                    <SimpleMde value={ this.state.editContent } onChange={ this.updateContent } />
                </div>
                <div className="editor-buttons">
                    <div className="ui basic blue button" onClick={ this.editArticle }>Submit</div>
                </div>
            </div>;
        } else {
            return <div className="content markdown-body" id="article-text" dangerouslySetInnerHTML={{ __html: this.state.articleText }}>
            </div>; 
        }
    },

    getTitle() {
        if (this.state.edit) {
            return <div className="ui input edit-title">
                       <input type="text" valueLink={ this.linkState('editTitle') }></input>
                   </div>;
        } else {
            return <div className="title">{ this.state.title }</div>;
        }
    },

    updateContent(content) {
        this.setState({
            editContent: content
        });
    },

    getOptions() {
		return {
			lineNumbers: true,
			mode: 'markdown',
			lineWrapping: true
		};
    },

    getEditButton() {
        if (sessionStorage.role == 'true')
            return <div className="ui basic button green" onClick={ this.switchMode }>Edit</div>
        else return null;
    },

    switchMode() {
        this.setState({
            edit: !this.state.edit
        });
    },

    editArticle() {
        let id = window.location.href.split('/');
        id = id[id.length - 1];
        const editUrl = `/api/articles/${id}`;
        // console.log('edit');
        $.ajax({
            method: 'PATCH',
            url: editUrl,
            data: {
                title: this.state.editTitle,
                content: this.state.editContent
            },
            dataType: 'json',
            success: (result) => {
                if (result.status == 'OK') {
                    alert('修改成功');
                    this.setState({
                        title: result.data.title,
                        editTitle: result.data.title,
                        articleText: marked(result.data.content),
                        editContent: result.data.content,
                        edit: false
                    });
                } else {
                    alert(result.msg);
                }
            }
        });
    }
});

$(function() {
	ReactDOM.render(<ArticleContent />, $("#article-content")[0], null);
});
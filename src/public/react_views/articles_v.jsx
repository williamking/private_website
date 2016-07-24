'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom');

// css导入
require('../sass/articles.sass');

const ArticleList = React.createClass({
    getInitialState: function() {
        return {
            articleList: [
            {
                title: '论如何进入德国骨科',
                description: '一个妹控的感言'
            },
            {
            	title: 'gulp的配置和使用',
            	description: '自行想象'
            }
            ]
        };
    },

    componentDidMount: function() {
        $.get('/api/article?mode=file', (list) => {
           this.setState({
               articleList: list
           });
        });
    },

	render: function() {
	    let list = this.renderList();
		return (
			<div className="articles-wrapper column">
			    <div className="articles-container">
			        <header className="ui dividing header">Recent Articles</header>
			        <div className="articles-list ui relaxed divided list">
			            { list }
			        </div>
			    </div>
			</div>
		);
	},

    // 文章列表生成
	renderList: function() {
		let list = [];
		this.state.articleList.map((item, key) => {
            list.push(
                <div className="article-item item" key={ key }>
                    <i className="large tag	middle aligned icon"></i>
                    <div className="middle aligned content">
                        <a className="header" href="/article/file">{ item.title }</a>
                        <div className="description">{ item.description }</div>
                    </div>
                </div>
            );
		});
		return list;
	}
});

$(function() {
	ReactDOM.render(<ArticleList />, $("#articles-main")[0], null);
});
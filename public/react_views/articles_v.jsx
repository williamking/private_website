'use strict';

// 组件导入
const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
const pageContain = 10;

const Pagination = require('../react_components/pagination.jsx');

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
            ],
            page: 1
        };
    },

    componentDidMount: function() {
        $.get('/api/article?mode=file', (result) => {
            if (result.status == 'OK') {
                let list = result.data.list;

                list.sort((a, b) => {
                    let timeA = new Date(a.createTime),
                        timeB = new Date(b.createTime);
                    return timeB - timeA;
                });

                this.setState({
                    articleList: list
                });
            }
        });
    },

	render: function() {
	    let list = this.renderList();
        let pages = this.state.articleList.length / pageContain;
        if (this.state.articleList.length % pageContain != 0) {
            ++pages;
        }
		return (
			<div className="articles-wrapper column">
			    <div className="articles-container">
			        <h1 className="ui dividing header">Recent Articles</h1>
			        <div className="articles-list ui relaxed divided list">
			            { list }
			        </div>
			    </div>
                <div className="pagination-container">
                    <Pagination setPage={ this.setPage } pages={ pages } />
                </div>
			</div>
		);
	},

    // 文章列表生成
	renderList: function() {
		let list = [];
        let partList = this.state.articleList.slice(
            (this.state.page - 1) * pageContain,
            this.state.page * pageContain);
		partList.map((item, key) => {
            let url = '/article/file/' + '?path=' + encodeURIComponent(item.path);
            let createTime = moment(item.createTime).format('YYYY-MM-DD');
            list.push(
                <div className="article-item item" key={ key }>
                    <i className="large bookmark middle aligned icon"></i>
                    <div className="middle aligned content">
                        <h2 className="header">
                            <a href={ url }>{ item.title }</a>
                        </h2>
                        <div className="description">{ item.description }</div>
                        <div className="time">Last edited at  
                            <span>
                                { ' ' + createTime }
                            </span>
                        </div>
                    </div>
                </div>
            );
		});
		return list;
	},

    //分页切换
    setPage: function(page) {
        this.setState({
            page: page
        });
    }
});

$(function() {
	ReactDOM.render(<ArticleList />, $("#articles-main")[0], null);
});
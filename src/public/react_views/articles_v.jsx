'use strict';

// 组件导入
const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
const UrlParser = require('../lib/url.js');

const pageContain = 10;

// css导入
require('../sass/articles.sass');

// React组件
const Tags = require('../react_components/tags.jsx');
const Pagination = require('../react_components/pagination.jsx');

const ArticleList = React.createClass({
  getInitialState: function() {
    return {
      // articleList: [
      // {
      //     title: '论如何进入德国骨科',
      //     description: '一个妹控的感言'
      // },
      // {
      // 	title: 'gulp的配置和使用',
      // 	description: '自行想象'
      // }
      // ],
      articleList: [],
      page: 1,
      file: false
    };
  },

  componentDidMount: function() {
    let urlParser = new UrlParser(window.location.href);
    let queryUrl = '/api/articles';
    let mode = urlParser.query['mode'];
    let tag = urlParser.query['tag'];
    if (mode) {
      queryUrl += '?mode=' + mode;
      if (mode == 'file') {
        this.setState({
          file: true
        });
      }
    }
    if (tag)
      queryUrl += '?tag=' + encodeURIComponent(tag);
    $.get(queryUrl, (result) => {
      if (result.status == 'OK') {
        let list = result.data.list;

        // list.sort((a, b) => {
        //     let timeA = new Date(a.createTime),
        //         timeB = new Date(b.createTime);
        //     return timeB - timeA;
        // });

        this.setState({
          articleList: list
        });
      } else {
        alert(result.msg);
      }
    });
  },

  render: function() {
    let list;
    if (this.state.file)
      list = this.renderFileList();
    else
      list = this.renderList();
    let pages = Math.ceil(this.state.articleList.length / pageContain);
    return (
      <div className="articles-wrapper column">
			    <div className="articles-container">
			        <h1 className="ui dividing header">
                        Recent Articles
                        { (() => {
        if (sessionStorage.role == 'true')
          return <a href="/article/create" className="ui green button">Create</a>
      })()
      }
                    </h1>
                    <div className="section">
			            <div className="articles-list ui relaxed divided list">
			                { list }
			            </div>
                        <div className="vertical-divider"></div>
                        <div className="tag list">
                            <Tags />
                        </div>
                    </div>
			    </div>
                <div className="pagination-container">
                    <Pagination setPage={ this.setPage } pages={ pages } />
                </div>
			</div>
      );
  },

  // 文章列表生成
  renderFileList: function() {
    let list = [];
    let partList = this.state.articleList.slice(
      (this.state.page - 1) * pageContain,
      this.state.page * pageContain);
    partList.map((item, key) => {
      let url = '/article/file/' + '?path=' + encodeURIComponent(item.path);
      let createTime = moment(item.lastEditTime).format('YYYY-MM-DD');
      list.push(
        <div className="article-item item" key={ key }>
                    <i className="large bookmark middle aligned icon"></i>
                    <div className="middle aligned content">
                        <h2 className="header">
                            <a href={ url }>{ item.title }</a>
                        </h2>
                        <div className="time">Last edited at
                            <span>
                                {' ' + createTime}
                            </span>
                        </div>
                    </div>
                </div>
      );
    });
    return list;
  },

  renderList: function() {
    let list = [];
    let partList = this.state.articleList.slice(
      (this.state.page - 1) * pageContain,
      this.state.page * pageContain);
    partList.map((item, key) => {
      let url = '/article/' + item._id;
      let lastEditTime = moment(item.lastEditAt).format('YYYY-MM-DD');
      list.push(
        <div className="article-item item" key={ key }>
                    <i className="large bookmark middle aligned icon"></i>
                    <div className="middle aligned content">
                        <h2 className="header">
                            <a href={ url }>{ item.title }</a>
                        </h2>
                        <div className="time">Last Edited at
                            <span>
                                {' ' + lastEditTime}
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

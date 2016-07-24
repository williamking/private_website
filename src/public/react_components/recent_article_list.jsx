"use strict";
const React = require('react');
const ReactDOM = require('react-dom');

require('../sass/recent_article_list.sass');

module.exports = React.createClass({

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

	render: function() {
	    let list = this.renderList();
		return (
			<div className="recent-articles-wrapper column">
			    <div className="recent-articles-container">
			        <header className="ui dividing header">Recent Articles</header>
			        <div className="recent-articles-list ui relaxed divided list">
			            { list }
			        </div>
			    </div>
			</div>
		);
	},

	renderList: function() {
		let list = [];
		this.state.articleList.map((item, key) => {
            list.push(
                <div className="person-info-item item" key={ key }>
                    <i className="large tag	middle aligned icon"></i>
                    <div className="middle aligned content">
                        <a className="header">{ item.title }</a>
                        <div className="description">{ item.description }</div>
                    </div>
                </div>
            );
		});
		return list;
	}
});
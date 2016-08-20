'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

require('../sass/index.sass');

//components
const Info = require('../react_components/info.jsx'),
      RecentArticleList = require('../react_components/recent_article_list.jsx');

let Index = React.createClass({
    getInitialState() {
        return {
            recentArticles: [],
            info: {
            	'姓名': '王嘉威',
            	'英文名': 'William.D.King',
            	'爱好': 'ACG、音乐',
            },
        };
    },

    render: function() {
    	return(
    		<div id="index-container">
    		    <div className="content-row ui two column grid">
    		        <Info data={ this.state.info } />
                    <div className="ui vertical divider"></div>
    		        <RecentArticleList data={ this.state.recentArticles } />
    		    </div>
    		</div>
    	);
    }
});

$(function() {
	ReactDOM.render(<Index />, $("#index")[0], null);
});
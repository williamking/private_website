'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom');

// css导入
require('../sass/article_content.sass');

const ArticleContent = React.createClass({
	getInitialState: function() {
        articleText: 'This article is empty now.'
	},

	componentDidMount: function() {
		$.get('/api/article/file?')
	}
});
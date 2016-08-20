'use strict';

// 引入模块
const React = require('react');

let TagColor = ['red', 'teal', 'green', 'purple', 'pink', 'yellow'];

require('../sass/tags.sass');

class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Tags';
        this.state = {
        	tags: []
        };
    }

    componentDidMount() {
        this.getTags();     
    }

    render() {
    	let tags = this.renderTags();
        return (
        	<div className="tags-wrapper">
        	    <h2 className="ui header">
        	    	<i className="tag blue icon"></i>
        	    	<div className="blue content">
        	    	    Tags
        	    	    <div className="sub header">Search by tag</div>
        	    	</div>
        	    </h2>
                <div className="tags">
                    { tags }
                </div>
        	</div>
        );
    }

    getRandomColor() {
    	let index = Math.floor(Math.random() * TagColor.length);
    	if (index == TagColor.length) --index;
    	return TagColor[index];
    }

    renderTags() {
    	let tags = [];
    	this.state.tags.forEach((tag, index) => {
            let color = this.getRandomColor();
            let className='ui tag label ' + color;
            let url = '/article?tag=' + tag;
            tags.push(
            	<a className={ className } key={ index } href={ url }>{ tag }</a>
            );
    	});
    	return tags;
    }

    getTags() {
    	$.get('/api/articles/tags', (result) => {
            if (result.status == 'OK') {
            	this.setState({
            		tags: result.data
            	});
            } else {
            	alert('数据库菌出了点问题......')
            }
    	});
    }
}

module.exports = Tags;

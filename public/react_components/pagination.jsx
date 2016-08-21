'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function() {
        return {
        	currentPage: 1
        }
	},

    render: function() {
    	let items = this.renderItems();
        return (
        	<div className="ui pagination menu">
                { items }
        	</div>
        );
    },

    renderItems: function() {
    	let items = [],
    	currentPage = this.state.currentPage,
        handleBeginClick = () => {
        	this.props.setPage(1);
        	this.setState({
        		currentPage: 1
        	});            	
        },
        handleEndClick = () => {
        	this.props.setPage(this.props.pages);
        	this.setState({
        		currentPage: this.props.pages
        	});
        };

    	items.push(
    		<a className="item" key='begin' onClick={ handleBeginClick }>
    		    Begin
    		</a>
    	);
    	if (currentPage - 3 > 1) {
    		items.push(<div className="disabled item" key='begin..'>...</div>);
    	}
    	for (let i = Math.max(currentPage - 3, 1); i <= Math.min(this.props.pages, currentPage + 3); ++i) {
            let handleClick = () => {
            	this.props.setPage(i);
            	this.setState({
            		currentPage: i
            	});
            };

    		if (i != currentPage) {
        		items.push(
                    <a className="item" key={ i } onClick={ handleClick }>
                        { i }
                    </a>
        		);
    	    } else {
        		items.push(
                    <a className="active item" key={ i }>
                        { i }
                    </a>
        		);
    	    }
    	}
    	if (currentPage + 3 < this.props.pages) {
    		items.push(<div className="disabled item" key='end..'>...</div>);
    	}
    	items.push(
    		<a className="item" key='end' onClick={ handleEndClick }>
    		    End
    		</a>
    	);
    	return items;
    }
});
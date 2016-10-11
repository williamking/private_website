'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const pageContain = 5;

// React组件
const Pagination = require('../react_components/pagination.jsx');

class LabList extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'LabList';
        this.state = {
            labList: [],
            page: 1
        };
    }

    render() {
    	let list = this.renderList();
    	let pages = Math.ceil(this.state.labList.length / pageContain);
        return (
            <div className="lab-list-wrapper">
                <h1 className="ui dividing header">William's Lab</h1>
                <div className="lab-list-container">
                    { list }
                </div> 
            </div>
        );
    }

    renderList() {
    	let list = [];
        let partList = this.state.lanList.slice(
            (this.state.page - 1) * pageContain,
            this.state.page * pageContain);
        this.state.partList.forEach((lab, index) => {
            list.push(
            	<div className="ui card" key={ index }>
            	    <div className="content">
            	        <div className="header">{ lab.name }</div>
            	    </div>
            	    <div className="content">
            	        <h4 className="ui sub header">Description</h4>
            	        <div className="small feed">
                            <div className="event">
                                <div className="content">
                                    <div className="summary">
                                        { lab.description }
                                    </div>
                                </div>
                            </div>
                        </div>
            	    </div>
            	</div>
            );
        });
        return list;
    }

}

module.exports = LabList;

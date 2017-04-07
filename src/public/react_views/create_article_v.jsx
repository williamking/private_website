'use strict';

// React
const React = require('react');
const ReactDOM = require('react-dom'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

//导入模块
const marked = require('marked');
const SimpleMde = require('../react_components/simple_mde.jsx');

// css导入
require('codemirror/mode/markdown/markdown');
require('codemirror/lib/codemirror.css');
require('../sass/create_article.sass');

const EditorMode = {
    edit: Symbol('edit'),
    preview: Symbol('preview')
};

const ArticleEditor = React.createClass({
	mixins: [LinkedStateMixin],

    /**
     * React组件生命周期方法
     */

	getInitialState() {
	    return {
	    	title: '',
	        content: '',
	        secret: false,
	        tags: [],
	        tagToAdd: '',
	        mode: EditorMode.edit
	    };
	},

    componentDidMount: function() {
        this.setValidation();
    },

    componentDidUpdate: function() {
        this.setValidation();
    },

	render() {
        var tags = [];
        for (let i = 0; i < this.state.tags.length; ++i) {
        	tags.push(this.produceTag(this.state.tags[i], i));
        }

        let content = (() => {
            switch (this.state.mode) {
            	case EditorMode.edit:
            	    return (
						        <SimpleMde onChange={ this.updateContent } value={this.state.content } />
            	    );
            	case EditorMode.preview:
            	    let markedContent = marked(this.state.content);
            	    return (
                        <div className="marked-wrapper" dangerouslySetInnerHTML={{ __html: markedContent }}>
                        </div>
            	    );
            }
        })();

        let toggle = (() => {
            if (this.state.mode === EditorMode.edit) {
            	return (<button className="ui green button" onClick={ this.previewArticle }>Preview</button>);
            } else {
            	return (<button className="ui red button" onClick={ this.editArticle }>Edit</button>);
            }
        })();

		return (
			<div className="article-editor-container">
			    <form id="article-editor" className="ui form">
			        <h1 className="ui dividing header">Create Article</h1>
			        <div className="field">
			            <label>Title</label>
			            <input type="text" name="title" placeholder="Title" valueLink={ this.linkState('title') }></input>
			        </div>
			        <div className="field">
			            <label>Tags</label>
			            <div className="two fields">
			                <div className="field">
			                    <div className="ui action input">
			                        <input type="text" placeholder="Add a tag" valueLink={ this.linkState('tagToAdd') }/>
			                        <button className="ui icon button" onClick={ this.addTag }>
			                            <i className="plus icon" id="add-tag"></i>
			                        </button>
			                    </div>
			                </div>
			                <div className="field">
			                    <div className="ui multiple fluid selection dropdown">
			                        { tags }
			                    </div>
			                </div>
			            </div>
			        </div>
			        <div className="field">
			            <div className="ui toggle checkbox">
			                <input type="checkbox" checked={ this.state.secret } name="title" placeholder="Title" onChange={ this.updateSecret }></input>
			                <label>Is it secret?</label>
			            </div>
			        </div>
			        { content }
			        <div className="article-control">
			            { toggle }
			            <button className="ui blue button" onClick={ this.checkForm }>Submit</button>
			        </div>
			    </form>
			</div>
		);
	},

	/**
	 * 下面是自定义方法
	 */

	updateContent(content) {
        this.setState({
            content
        });
	},

	getOptions() {
		return {
			lineNumbers: true,
			mode: 'markdown',
			lineWrapping: true
		};
	},

	createArticle() {
        $.post('/api/articles/create', {
        	title: this.state.title,
        	content: this.state.content,
        	secret: this.state.secret,
        	category: this.state.tags
        }, (result) => {
            if (result.status == 'OK') {
                alert('发表成功');
                window.location.href = '/article/' + result.articleId;
            } else {
            	alert(result.msg);
            }
        });
	},

	produceTag(tag, index) {
		return (
		    <a className="ui label transition visible" key={ index } style={{ display: 'inline-block !important' }}>
			    { tag }
			    <i className="delete icon" data-index={ index } onClick={ this.deleteTag }></i>
		    </a>
		);
	},

	addTag(e) {
		e.preventDefault();
		let newTag = this.state.tagToAdd;
		let tags = this.state.tags;
		if(tags.indexOf(newTag) != -1) {
			alert('标签重复!');
		} else {
		    tags.push(newTag);
		}
		this.setState({
			tags,
			tagToAdd: ''
		});
	},

	deleteTag(event) {
        let index = $(event.currentTarget).data('index');
        index = parseInt(index);
        let tags = this.state.tags;
        tags.splice(index, 1);
        this.setState({
        	tags
        });
	},

	updateSecret(e) {
		this.setState({
			secret: e.target.checked
		});
	},

	previewArticle(e) {
		e.preventDefault();
		this.setState({
            mode: EditorMode.preview
		});
	},

	editArticle(e) {
		e.preventDefault();
		this.setState({
            mode: EditorMode.edit
		});
	},

	setValidation() {
        $('#article-editor').form({
        	fields: {
        		title: 'empty',
        		content: 'empty'
        	},
        	onSuccess: this.createArticle
        });
	},

    checkForm(e) {
    	e.preventDefault();
    	$('#article-editor').form('validate form');
    }

});

(function() {
	ReactDOM.render(<ArticleEditor />, document.querySelectorAll("#edit-article-main")[0]);
})();

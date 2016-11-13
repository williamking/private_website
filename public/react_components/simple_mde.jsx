'use strict';

// 引入模块
const React = require('react');
const SimpleMde = require('simplemde/dist/simplemde.min.js');
require('../../../bower_components/inline-attachment/src/inline-attachment.js');
require('../../../bower_components/inline-attachment/src/codemirror.inline-attachment.js');
require('simplemde/dist/simplemde.min.css');

class ReactSimpleMde extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SimpleMde';
    }

    componentDidMount() {
        this.simplemde = new SimpleMde({
            element: this.dom,
            autofocus: true,
            autosave: {
                enabled: true,
                uniqueId: "MyUniqueID",
                delay: 1000,
            }
        });
        this.simplemde.value(this.props.value);
        this.simplemde.codemirror.on('change', () => {
          this.props.onChange(this.simplemde.value());
        });

        let option = {
            uploadUrl: '/api/articles/attachment',
            uploadFieldName: 'image',
            jsonFieldName: 'downloadUrl'
        };

        inlineAttachment.editors.codemirror4.attach(this.simplemde.codemirror, option);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value != this.simplemde.value()) {
            this.simplemde.value(nextProps.value);
        }
    }

    render() {
        return (
            <textarea className='simple-mde-wrapper' ref={ (dom) => this.dom = dom }>
            </textarea>
        );
    }
}

module.exports = ReactSimpleMde;

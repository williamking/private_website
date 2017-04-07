'use strict';

// 引入模块
const React = require('react');
const SimpleMde = require('simplemde');
const marked = require('marked');
const highlight = require('highlightjs');

require('font-awesome/css/font-awesome.min.css');
require('inline-attachment/src/inline-attachment.js');
require('inline-attachment/src/codemirror.inline-attachment.js');
require('simplemde/dist/simplemde.min.css');

class ReactSimpleMde extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SimpleMde';
    }

    componentDidMount() {
        this.setMarked();
        this.setMathJax();
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

    // marked设置
    setMarked() {
        marked.setOptions({
            highlight: (code) => {
                return highlight.highlightAuto(code).value;
            }
        });
    }

    setSimpleMde() {
        let previewRender = (plainText, preview) => {
            $(preview).addClass('markdown-body');
            $(preview).html(marked(plainText));
            MathJax.Hub.Typeset(preview);
            return preview.innerHTML;
        };

        this.simplemde = new SimpleMde({
            autoDownloadFontAwesome: false,
            element: this.dom,
            autofocus: true,
            autosave: {
                enabled: true,
                uniqueId: "MyUniqueID",
                delay: 1000,
            },
            previewRender
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

    // 设置mathJax插件
    setMathJax() {
        if (!window.MathJax) {
            var mathjaxScript = document.createElement('script');
            mathjaxScript.type = 'text/javascript';
            mathjaxScript.src = '/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
            $('head')[0].appendChild(mathjaxScript);
            $(mathjaxScript).load(this.setSimpleMde.bind(this));
        } else {
            this.setSimpleMde();
        }
    }
}

module.exports = ReactSimpleMde;

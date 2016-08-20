React = require 'react'
ReactDOM = require 'react-dom'

FileTransfer = React.createClass {
    getInitialState: ->
        fileList: []

    render: ->
        return (
            <div id="file-transfer">
                <header>文件上传测试</header>
                <div id="file-select>
                    <input type="file"/>
                    <button id="file-upload“>上传</button>
                </div>
                <FileState fileList={this.state.fileList} />
            </div>
        )

}

FileState = React.createClass {
    render: ->
        files = this.props.fileList.map (file, key)->
            if (file.status == 'waiting') then status = '等待上传'
            if ((typeof file.status) == number) then status = file.status
            if (file.status == 'complete') then status = '上传成功'
            if (file.status == 'error') then status = '出现异常'
            
            
            if (file.status == 'waiting') then operation = '删除'
            if ((typeof file.status) == number) then operation = '暂停'
            if (file.status == 'complete') then operation = '上传成功'
            if (file.status == 'error') then operation = '重试' 

            return ( 
                <tr className="table-header">
                    <td className="table-filename">file.name</td>
                    <td className="table-filetype">file.type</td>
                    <td className="table-filesize">file.size</td>
                    <td className="table-filestatus">file.status</td>
                    <td className="table-file-operation">operation</td>
                </tr>
            )

        return (
            <div id="file-status">
                <table id="file-state-form">
                    <tbody>
                        <tr className="table-header">
                            <td className="table-filename">filename</td>
                            <td className="table-filetype">type</td>
                            <td className="table-filesize">size</td>
                            <td className="table-filestatus">status</td>
                            <td className="table-file-operation">operation</td>
                        </tr>
                    </tbody>
                    {files}
                </form>
            </div>
        )

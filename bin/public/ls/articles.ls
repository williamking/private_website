#    > Author: William
#    > Email: williamjwking@gmail.com

$ !->
    path = new RegExp \/articles\/.*
    npath = new RegExp \/articles\/create

    alert-message = (msg, callback)->
        $('#authorize-message').find 'p' .text(msg)
        $('#authorize-message').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'
        if callback then $('#authorize-message').find '.message-confirm' .click callback

    if path.test window.location.pathname and not npath.test window.location.pathname
        # Init the editor
        ue = UE.getEditor 'comment-content', {
            toolbars: [
                ['fullscreen', 'undo', 'redo', 'anchor', 'cleardoc', 'time', 'date', 'link', 'emotion', 'spechars', 'insertcode', 'source', 'snapscreen' 'simpleupload', 'insertimage'],
                ['fontfamily', 'fontsize', 'forecolor','indent', 'italic', 'underline', 'strikethrough', 'fontborder', 'justifyleft', 'justifycenter', 'justifyright']
            ],
            initialFrameHeight: 200,
            initialFrameWidth: 800
        }

        $ '#comment-submit' .click (e)!->
            block = $ '#comment-block'
            content = ue.get-content!
            $.ajax {
                url: '/comment/create/' + block.attr("reply-to")
                data: {
                    content: content,
                    commentor: block.find '#commentor' .val!
                    reply-to: null
                }
                type: 'post',
                success: (data)!->
                    if data.result is 'Success'
                        alert-message data.result, !->
                            window.location.reload!
                    else
                        alert-message data.result + ' ' + data.msg
                error: (req)!->
                    alert-message req.status + ' ' + req.status-text
            }

#    > Author: William
#    > Email: williamjwking@gmail.com


$ !->
    alert-message = (msg, callback)->
        $('#authorize-message').find 'p' .text(msg)
        $('#authorize-message').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'
        if callback then $('#authorize-message').find '.message-confirm' .click callback
    if window.location.pathname is '/articles/create'
        # Init the editor
        ue = UE.getEditor 'article-content', {
            toolbars: [
                ['fullscreen', 'undo', 'redo', 'anchor', 'cleardoc', 'time', 'date', 'link', 'emotion', 'spechars', 'insertcode', 'source', 'snapscreen' 'simpleupload', 'insertimage'],
                ['fontfamily', 'fontsize', 'forecolor','indent', 'italic', 'underline', 'strikethrough', 'fontborder', 'justifyleft', 'justifycenter', 'justifyright']
            ],
            initialFrameHeight: 500,
            initialFrameWidth: 800
        }

        # Submit artilce
        $ '#article-submit' .click !->
            $.ajax {
                url: '/articles/create',
                data: {
                    title: $ '#article-form' .find "[name='title']" .val!,
                    content: ue.get-content!,
                    secret: $ '#article-form' .find("[name='secret']")[0].checked is 'checked',
                    category: [],
                    secret-password: $ '#article-form' .find "[name='secret-password']" .val!
                },
                type: 'post',
                success: (data)!->
                    if data.result is 'Success'
                        alert-message data.result, !->
                            window.location.href = '/articles/' + data.article-id
                    else
                        alert-message data.result + ' ' + data.msg
                error: (req)!->
                    alert-message req.status + ' ' + req.status-text
            }




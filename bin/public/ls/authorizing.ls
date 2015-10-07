#    >Author: William
#    >Email: williamjwking@gmail.com

$ !->
    # Set the authorizing button

    alert-message = (msg, callback)->
        $('#authorize-message').find 'p' .text(msg)
        $('#authorize-message').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'
        if callback then $("#authorize-message").find '.close' .click callback

    $('#profile-button').click !->
        window.location.href="/profile"

    $('#logout-button').click !->
        $.get '/logout', (msg, status)->
            show-the-message msg, "logout"

    $('#login-button').click !->
        $('#login').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'

    $('#register-button').click !->
        $('#register').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'

    $ '.close' .click (e)!->
        $(e.current-target).parent! .parent! .remove-class 'extent-in-animate' .add-class 'extent-out-animate' .add-class 'invisible'

    $ '.cancel' .click (e)!->
        $(e.current-target).parent! .parent! .remove-class 'extent-in-animate' .add-class 'extent-out-animate' .add-class 'invisible'

    $ '.message-confirm' .click (e)!->
        $(e.current-target).parent! .parent! .remove-class 'extent-in-animate' .add-class 'extent-out-animate' .add-class 'invisible'

    $ '#login-submit' .click (e)!->
        form = $(e.current-target).parent! .parent!
        $.ajax {
            url: '/login',
            data: {
                username: form.find("[name='username']").val!
                password: form.find("[name='password']").val!
            },
            type: 'post',
            success: (data)!->
                if data.result is 'success'
                    alert-message data.result, !->
                        window.location.reload!
                else
                    alert-message data.result + ' ' + data.msg
            error: (req)!->
                alert-message req.status + ' ' + req.statusText
        }

    $ '#register-submit' .click (e)!->
        form = $(e.current-target).parent! .parent!
        $.ajax {
            url: '/login',
            data: {
                username: form.find("[name='username']").val!
                password: form.find("[name='password']").val!
            },
            type: 'post',
            success: (data)!->
                if data.result is 'success'
                    alert-message data.result, !->
                        window.location.reload!
                else
                    alert-message data.result + ' ' + data.msg
            error: (req)!->
                alert-message req.status + ' ' + req.statusText
        }



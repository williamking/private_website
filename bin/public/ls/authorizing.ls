#    >Author: William
#    >Email: williamjwking@gmail.com

$ !->
    # Set the authorizing button

    $('#profile-button').click !->
        window.location.href="/profile"

    $('#logout-button').click !->
        $.get '/logout', (msg, status)->
            show-the-message msg, "logout"

    $('#login-button').click !->
        $('#login').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'

    $('#register-button').click !->
        $('#register').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'

    $ '.modal2' .find '.close' .click (e)!->
        target = e.current-target
        $(target).parent().parent().remove-class 'extent-in-animate' .add-class 'extent-out-animate' .add-class 'invisible' 
#set-timeout "$('.extent-out-animate').addClass('invisible')", 0

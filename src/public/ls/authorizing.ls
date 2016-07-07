#    >Author: William
#    >Email: williamjwking@gmail.com

alert-message = (msg, callback)->
    $('#authorize-message').find 'p' .text(msg)
    $('#authorize-message').remove-class 'invisible' .remove-class 'extent-out-animate' .add-class 'extent-in-animate'
    if callback then $('#authorize-message').find '.message-confirm' .click callback
$ !->
    # Set the authorizing button
    $('#profile-button').click !->
        window.location.href="/profile"

    $('#logout-button').click !->
        $.get '/logout', (data)->
            alert-message data.result + ' ' + data.msg, !->
                window.location.reload!

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
                if data.result is 'Success'
                    alert-message data.result, !->
                        window.location.reload!
                else
                    alert-message data.result + ' ' + data.msg
            error: (req)!->
                alert-message req.status + ' ' + req.statusText
        }

    check-validation = (user)->
        if not /^[a-zA-z][a-zA-Z0-9]{3,}$/.test user.name then return '用户名须4位以上字母或数字组成，不得以数字开头'
        if not /^[a-zA-Z0-9]{8,}$/.test user.password then return '密码长度最小8位'
        if not /^([a-zA-Z0-9\u4e00-\u9fa5]+[_|\_|\.-]?)*[a-zA-Z0-9\u4e00-\u9fa5]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test user.email then return '请输入符合格式的邮箱地址'
        if not /^[0-9]{6,}$/.test user.qq then return '请输入合法的qq'
        #if not /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test user.birthday then return '日期格式不正确'
        return 'valid'

    $ '#register-submit' .click (e)!->
        form = $(e.current-target).parent! .parent!
        data = {
            username: form.find("[name='username']").val!,
            password: form.find("[name='password']").val!,
            type: 'admin',
            email: form.find("[name='email']").val!,
            signature: form.find("[name='signature']").val!,
            qq: form.find("[name='qq']").val!,
            birthday: form.find("[name='birthday']").val!
        }
        validation-msg = check-validation data
        if validation-msg != 'valid'
            alert-message validation-msg
            return
        if data.password isnt form.find("[name='confirm-password']").val!
            alert-message '两次设置的密码不相同'
            return
        $.ajax {
            url: '/reg',
            data: data,
            type: 'post',
            success: (data)!->
                if data.result is 'success'
                    alert-message data.result, !->
                        window.location.reload!
                else
                    alert-message data.result + ' ' + data.msg
            error: (req)!->
                alert-message req.status + ' ' + req.responseText
        }

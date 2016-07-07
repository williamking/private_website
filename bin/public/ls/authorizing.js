// Generated by LiveScript 1.3.1
(function(){
  var alertMessage;
  alertMessage = function(msg, callback){
    $('#authorize-message').find('p').text(msg);
    $('#authorize-message').removeClass('invisible').removeClass('extent-out-animate').addClass('extent-in-animate');
    if (callback) {
      return $('#authorize-message').find('.message-confirm').click(callback);
    }
  };
  $(function(){
    var checkValidation;
    $('#profile-button').click(function(){
      window.location.href = "/profile";
    });
    $('#logout-button').click(function(){
      $.get('/logout', function(data){
        return alertMessage(data.result + ' ' + data.msg, function(){
          window.location.reload();
        });
      });
    });
    $('#login-button').click(function(){
      $('#login').removeClass('invisible').removeClass('extent-out-animate').addClass('extent-in-animate');
    });
    $('#register-button').click(function(){
      $('#register').removeClass('invisible').removeClass('extent-out-animate').addClass('extent-in-animate');
    });
    $('.close').click(function(e){
      $(e.currentTarget).parent().parent().removeClass('extent-in-animate').addClass('extent-out-animate').addClass('invisible');
    });
    $('.cancel').click(function(e){
      $(e.currentTarget).parent().parent().removeClass('extent-in-animate').addClass('extent-out-animate').addClass('invisible');
    });
    $('.message-confirm').click(function(e){
      $(e.currentTarget).parent().parent().removeClass('extent-in-animate').addClass('extent-out-animate').addClass('invisible');
    });
    $('#login-submit').click(function(e){
      var form;
      form = $(e.currentTarget).parent().parent();
      $.ajax({
        url: '/login',
        data: {
          username: form.find("[name='username']").val(),
          password: form.find("[name='password']").val()
        },
        type: 'post',
        success: function(data){
          if (data.result === 'Success') {
            alertMessage(data.result, function(){
              window.location.reload();
            });
          } else {
            alertMessage(data.result + ' ' + data.msg);
          }
        },
        error: function(req){
          alertMessage(req.status + ' ' + req.statusText);
        }
      });
    });
    checkValidation = function(user){
      if (!/^[a-zA-z][a-zA-Z0-9]{3,}$/.test(user.name)) {
        return '用户名须4位以上字母或数字组成，不得以数字开头';
      }
      if (!/^[a-zA-Z0-9]{8,}$/.test(user.password)) {
        return '密码长度最小8位';
      }
      if (!/^([a-zA-Z0-9\u4e00-\u9fa5]+[_|\_|\.-]?)*[a-zA-Z0-9\u4e00-\u9fa5]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(user.email)) {
        return '请输入符合格式的邮箱地址';
      }
      if (!/^[0-9]{6,}$/.test(user.qq)) {
        return '请输入合法的qq';
      }
      return 'valid';
    };
    $('#register-submit').click(function(e){
      var form, data, validationMsg;
      form = $(e.currentTarget).parent().parent();
      data = {
        username: form.find("[name='username']").val(),
        password: form.find("[name='password']").val(),
        type: 'admin',
        email: form.find("[name='email']").val(),
        signature: form.find("[name='signature']").val(),
        qq: form.find("[name='qq']").val(),
        birthday: form.find("[name='birthday']").val()
      };
      validationMsg = checkValidation(data);
      if (validationMsg !== 'valid') {
        alertMessage(validationMsg);
        return;
      }
      if (data.password !== form.find("[name='confirm-password']").val()) {
        alertMessage('两次设置的密码不相同');
        return;
      }
      $.ajax({
        url: '/reg',
        data: data,
        type: 'post',
        success: function(data){
          if (data.result === 'success') {
            alertMessage(data.result, function(){
              window.location.reload();
            });
          } else {
            alertMessage(data.result + ' ' + data.msg);
          }
        },
        error: function(req){
          alertMessage(req.status + ' ' + req.responseText);
        }
      });
    });
  });
}).call(this);
// Generated by LiveScript 1.3.1
(function(){
  $(function(){
    var alertMessage, ue;
    alertMessage = function(msg, callback){
      $('#authorize-message').find('p').text(msg);
      $('#authorize-message').removeClass('invisible').removeClass('extent-out-animate').addClass('extent-in-animate');
      if (callback) {
        return $('#authorize-message').find('.message-confirm').click(callback);
      }
    };
    if (window.location.pathname === '/articles/create') {
      ue = UE.getEditor('article-content', {
        toolbars: [['fullscreen', 'undo', 'redo', 'anchor', 'cleardoc', 'time', 'date', 'link', 'emotion', 'spechars', 'insertcode', 'source', 'snapscreen', 'simpleupload', 'insertimage'], ['fontfamily', 'fontsize', 'forecolor', 'indent', 'italic', 'underline', 'strikethrough', 'fontborder', 'justifyleft', 'justifycenter', 'justifyright']],
        initialFrameHeight: 500,
        initialFrameWidth: 800
      });
      $('#article-submit').click(function(){
        $.ajax({
          url: '/articles/create',
          data: {
            title: $('#article-form').find("[name='title']").val(),
            content: ue.getContent(),
            secret: $('#article-form').find("[name='secret']")[0].checked === 'checked',
            category: [],
            secretPassword: $('#article-form').find("[name='secret-password']").val()
          },
          type: 'post',
          success: function(data){
            if (data.result === 'Success') {
              alertMessage(data.result, function(){
                window.location.href = '/articles/' + data.articleId;
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
    }
  });
}).call(this);
// Generated by LiveScript 1.3.1
(function(){
  $(function(){
    var path, npath, alertMessage, ue;
    path = new RegExp('/articles/.*');
    npath = new RegExp('/articles/create');
    alertMessage = function(msg, callback){
      $('#authorize-message').find('p').text(msg);
      $('#authorize-message').removeClass('invisible').removeClass('extent-out-animate').addClass('extent-in-animate');
      if (callback) {
        return $('#authorize-message').find('.message-confirm').click(callback);
      }
    };
    if (path.test(window.location.pathname) && !npath.test(window.location.pathname)) {
      ue = UE.getEditor('comment-content', {
        toolbars: [['fullscreen', 'undo', 'redo', 'anchor', 'cleardoc', 'time', 'date', 'link', 'emotion', 'spechars', 'insertcode', 'source', 'snapscreen', 'simpleupload', 'insertimage'], ['fontfamily', 'fontsize', 'forecolor', 'indent', 'italic', 'underline', 'strikethrough', 'fontborder', 'justifyleft', 'justifycenter', 'justifyright']],
        initialFrameHeight: 200,
        initialFrameWidth: 800
      });
      $('#comment-submit').click(function(e){
        var block, content;
        block = $('#comment-block');
        content = ue.getContent();
        $.ajax({
          url: '/comment/create/' + block.attr("reply-to"),
          data: {
            content: content,
            commentor: block.find('#commentor').val(),
            replyTo: null
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
    }
  });
}).call(this);
window.onmessage = (e) => {
    $('#received-message').val(e.data);
    alert('收到一条新消息');
};
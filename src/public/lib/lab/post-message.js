var receiveWindow = null;

$('#open-window').click(function() {
    receiveWindow = window.open('/lab/cross/getMessage', 'receiveWindow');
});

$('#submit').click(function() {
    if (!receiveWindow) return alert('请打开接收信息的窗口!');
    receiveWindow.postMessage($('#message').val(), 'https://localhost:3000');
})

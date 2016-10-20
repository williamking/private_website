window.onmessage = (e) => {
    e = e || event;
    eval(e.data);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('get','https://localhost:3000/api/articles', false);
    alert('send data');
    callback('2333');
    xmlhttp.onreadystatechange = () => {
    	alert('1');
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	let text = xmlhttp.responseText;
        	console.log(callback);
        	callback(text);
        }
    };
    xmlhttp.send();
};
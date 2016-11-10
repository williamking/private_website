exports.renderIndex = (req, res) => {
    res.render('lab');
};

exports.renderCrossPage = (req, res) => {
    res.render('crossing-field');
};

exports.renderGetMessage = (req, res) => {
    res.render('get-message');
};

exports.handleJsonp = (req, res) => {
	res.jsonp({answer: '2333'});
};

exports.renderThreeJsPage = (req, res) => {
    res.render('3dworld.pug');
};
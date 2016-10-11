exports.renderIndex = (req, res) => {
    res.render('lab');
};

exports.renderCrossPage = (req, res) => {
    res.render('crossing-field');
};

exports.handleJsonp = (req, res) => {
	res.jsonp({answer: '2333'});
};	
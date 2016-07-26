'use strict';

exports.requireLogin = (req, res, next) => {
    console.log req.session.user
    if req.session.user then next(); 
    else res.json({result: 'failed', msg: 'Login required'});
}

exports.hasLogin = (req, res, next) => {
    if not req.session.user then next();
    else res.json({result: 'failed', msg: 'You haved logined!'});
}

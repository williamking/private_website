authorizor = exports

authorizor.require-login = (req, res, next)!->
    if req.session.user then next! else res.json {result: 'failed', msg: 'Login required'}

authorizor.has-login = (req, res, next)!->
    if not req.session.user then next! else res.json {result: 'failed', msg: 'You haved logined!'}

require! {'express', 'bcrypt', 'fs', 'path', 'url', http, moment}

require-login = require('./authorization/authorize.js').require-login
has-login = require('./authorization/authorize').has-login

User = require('../models/User.js')

config = require '../public/lib/utf8-php/config.js'

router = express.Router!

router.use '/', (req, res)!->
    uploads-path = path.resolve('resources') + '/images/uploads/'
    console.log uploads-path
    action =
        uploadimage: (req, res)!->
            fstream = null
            req.pipe req.busboy
            req.busboy.on 'file', (fieldname, file, filename, encoding, minetype)!->
                filesize = 0
                ext = path.extname filename
                new-file-name = (new Date!)
                new-file-name = new-file-name - 0 + ext
                fstream = fs.create-write-stream uploads-path + new-file-name
                file.on 'data', (data)!->
                    filesize = data.length
                fstream.on 'close', !->
                    res.send JSON.stringify {
                        "originalName": filename,
                        "name": new-file-name,
                        "url": '/images/uploads/' + new-file-name
                        "type": ext,
                        "size": filesize,
                        "state": "SUCCESS"
                    }
                file.pipe fstream
        ,
        config: (req, res)->
            res.json config
        ,
        listimage: (req, res)!->
            fs.readdir uploads-path, (err, files)!->
                total = 0
                list = []
                files.sort! .splice req.query.start, req.query.size .for-each (a, b)!->
                    list.push({
                        url: '/images/uploads/' + a,
                        mtime: new Date fs.stat-sync(uploads + a).mine .get-time!
                    })
                total = list.length
                res.json {
                    state: if total is 0 then 'no match file' else 'SUCCESS',
                    list: list,
                    total: total,
                    start: req.query.start
                }
        ,
        catchimage: (req, res)!->
            list = []
            req.body.source.forEach (src, index)!->
            http.get src, (_res)!->
                imagedata = ''
                _res.set-encoding 'binary'
                _res.on 'data', (chunk)!->
                    imagedata += chunk
                _res.on 'end', !->
                    pathname = url.parse src .pathname
                    original = pathname.match /[^/]+\.\w+$/g [0]
                    suffix = original.match /[^\.]+$/ [0]
                    filename = Data.now + '.' + suffix
                    filepath = uploadspath + 'catchimages/' + filename
                    fs.write-file filepath, imagedata, 'binary', (err)!->
                        list.push {
                            original: original,
                            source: src,
                            state: if err then  "ERROR" else "SUCCESS"
                            title: filename,
                            url: 'uploads/catchimages/' + filename
                        }
            func = !->
                if req.body.source.length is list.length
                    clear-interval f
                    res.json {state: "SUCCESS", list: list}
            f = set-interval func, 50
    action[req.query.action](req, res)

module.exports = router

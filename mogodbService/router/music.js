var express = require('express');
var router = express.Router();
const http = require("http");
router.post('/search', async function(req, res, next) {
    const {keywords} = req.body
    let url = 'http://localhost:3003/search?keywords='+encodeURI(keywords)
    
    var body = '';
    http.get(url, (resp) => {
        resp.on('data',(data)=>{
            body += data;
        }).on('end', ()=>{
             body = JSON.parse(body)
            res.send({data:body})
        })
    })
})

router.post('/song/url', async function(req, res, next) {
    const {id} = req.body
    let url = 'http://localhost:3003/song/url?id='+encodeURI(id)
    
    var body = '';
    http.get(url, (resp) => {
        resp.on('data',(data)=>{
            body += data;
        }).on('end', ()=>{
             body = JSON.parse(body)
            res.send({data:body})
        })
    })
})

module.exports = router;
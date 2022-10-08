const express = require('express')
const http = require('http')
const router = express.Router()

router.get('/test', (req, res, next) => {
  const param = { test: 'success' }
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.send(param)
})

router.post('/post', (req, resp, next) => {
  const options = {
    host: 'http://elasticsearch',
    port: '9200',
    path: '/price/_doc/',
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  http.request(options, (res) => {
    res.setEncoding('utf8')

    res.on('data', (chunk) => {
      resp.send(chunk)
    })
  })
  req.on('error', (err) => {
    resp.send(err)
  })
  req.write()
  req.end()
})

router.get('/search',  (req, resp, next) => {
  resp.header('Content-Type', 'application/json; charset=utf-8')

  const header = "source_content_type=application/json"
  const query = {
    sort: [{"date": {"order": "asc", format: "strict_date_optional_time_nanos"}}],
    query: {match: { "name": req.query.name}},
    size: 30
  }

  http.get(`http://elasticsearch:9200/price/_search?source=${JSON.stringify(query)}&${header}`, (res) => {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      body += chunk
    })

    res.on('end', (res) => {
      res = JSON.parse(body)
      resp.send(res)
    })
  })
    .on('error', (err) => {
      resp.send(err)
    })
})

module.exports = router

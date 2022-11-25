const express = require('express')
const request = require("request");
const es = require('../esClient')

const router = express.Router()
const config = process.env

router.post('/register_item', (req, resp, next) => {
  //すでに登録されていないかチェック
  // es.search({
  //   index: 'items',
  //   body: {
  //     query: {
  //       match: { 'name': req.body.name }
  //     }
  //   }
  // })
  //   .then(res => {
  //     resp.send(res.body.hits.total['value'].toString())
  //   })
  //   .catch(err => resp.send(err))
  //   .finally(() => next())

  const options = {
    url: `${config.API_HOST}:${config.API_PORT}/items/_doc/`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    json: {
      name: req.body.name,
      category: req.body.category,
      subcategory: req.body.subcategory,
    }
  }

  request.post(options, (err, res, body) => {
    resp.send(body)
  })
})

module.exports = router

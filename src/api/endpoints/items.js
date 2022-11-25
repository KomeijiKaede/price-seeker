const express = require('express')
const router = express.Router()

const es = require('../esClient')

router.get('/items', (req, resp, next) => {
  es.search({
    index: 'items',
    body: {
      size: 1000,
      query: {
        match: {
          'subcategory': req.query.subcategory
        }
      }
    }
  })
    .then(res => {
      const items = []
      for (const i of res.body.hits.hits) {
        items.push(i._source.name)
      }
      resp.json({items})
    })
})

module.exports = router

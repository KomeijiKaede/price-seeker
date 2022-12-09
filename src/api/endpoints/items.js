const express = require('express')
const router = express.Router()

const es = require('../esClient')

router.get('/items', (req, resp, next) => {
  es.search({
    index: 'items',
    body: {
      size: 1000,
      sort: [ { name: { order: 'asc' } } ],
      query: { term: { subcategory: req.query.subcategory } }
    }
  })
    .then(res => {
      const items = []
      for (const i of res.body.hits.hits) {
        items.push(i._source.name)
      }
      resp.json({items})
    })
    .catch(err => {
      resp.status(400).json({ message: ['アイテムの取得に失敗しました'], error: err })
    })
    .finally(() => { next() })
})

module.exports = router

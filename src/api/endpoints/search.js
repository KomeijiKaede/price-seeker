const express = require('express')
const router = express.Router()

const es = require('../esClient')

router.get('/search', async (req, resp, next) => {
  const search = await es.search({
    index: 'price',
    body: {
      size: req.query.size,
      sort: [{"date": {"order": "desc", format: "strict_date_optional_time_nanos"}}],
      query: {
        bool: {
          must: {
            term: { 'name': req.query.name },
          },
          filter: {
            range: {
              date: {
                gte: req.query.gte,
                lte: req.query.lte
              }
            }
          }
        }
      }
    }
  })
  const data = formatData(search)
  resp.json({
    name: req.query.name,
    items: data
  })
})

function formatData(res) {
  const data = []
  for (const i of res.body.hits.hits) {
    data.push([Date.parse(i._source.date), Number(i._source.price)])
  }
  return data
}

module.exports = router

const express = require('express')
const http = require('http')
const router = express.Router()
const request = require('request')
const config = process.env

const es = require('./esClient')

const host = `http://${config.API_HOST}:${config.API_PORT}`

/*
router.get('/submit', (req, resp, next) => {
  const options = {
    url: `${host}/price/_doc/`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    json: {
      name: req.query.name,
      type: req.query.type,
      price: req.query.price,
      date: new Date()
    }
  }

  request.post(options, (err, res, body) => {
    resp.send(body)
  })
})
*/

/*
router.get('/register_item', (req, resp, next) => {
  // すでに登録されていないかチェック
  // es.search({
  //   index: 'items',
  //   body: {
  //     query: {
  //       match: { 'name': req.body.name }
  //     }
  //   }
  // })
  //   .then(res => resp.send(res.body.hits.total['value'].toString()))
  //   .catch(err => resp.send(err))
  //   .finally(() => next())

  const options = {
    url: `${host}/items/_doc/`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    json: {
      name: req.query.name,
      category: req.query.category,
      subcategory: req.query.subcategory,
    }
  }

  request.post(options, (err, res, body) => {
    resp.send(body)
  })
})
*/

router.get('/getitems', (req, resp, next) => {
  const options = {
    url: `${host}/items/_search?size=1000`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  request.get(options, (err, res, body) => {
    resp.send(body)
  })
})

/*
router.get('/delete', (req, resp, next) => {
  const options = {
    url: `${host}/price/_doc/${req.query.id}`
  }

  request.delete(options, (err, res, body) => {
    resp.send(body)
  })
})
*/

router.get('/item_list', (req, resp, next) => {
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
    .then(res => resp.send(res.body))
    .catch(err => resp.send(err))
    .finally(() => next())
})

// router.post('/search', (req, resp, next) => {
//   es.search({
//     index: 'price',
//     body: {
//       size: req.body.size,
//       sort: [{"date": {"order": "desc", format: "strict_date_optional_time_nanos"}}],
//       query: {
//         bool: {
//           must: {
//             term: { 'name': req.body.name },
//           },
//           filter: {
//             range: {
//               date: {
//                 gte: req.body.gte,
//                 lte: req.body.lte
//               }
//             }
//           }
//         }
//       }
//     }
//   })
//     .then(res => resp.send(res.body))
//     .catch(err => resp.send(err))
//     .finally(() => next())
// })

router.post('/exists', (req, resp, next) => {
  es.search({
    index: 'items',
    body: {
      query: {
        match: { 'name': req.body.name }
      }
    }
  })
    .then(res => resp.send(res.body.hits.total['value'].toString()))
    .catch(err => resp.send(err))
    .finally(() => next())
})

/*
router.get('/search',  (req, resp, next) => {
  resp.header('Content-Type', 'application/json; charset=utf-8')

  const header = "source_content_type=application/json"
  const query = {
    sort: [{"date": {"order": "asc", format: "strict_date_optional_time_nanos"}}],
    query: {
      match: {
        "name": req.query.name
      },
      // range: {
      //   "date": {
      //     "gte": req.query.range_start,
      //     "lte": req.query.range_end
      //   }
      // }
      },
    size: req.query.size
  }

  http.get(`${host}/price/_search?source=${JSON.stringify(query)}&${header}`, (res) => {
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
*/

module.exports = router

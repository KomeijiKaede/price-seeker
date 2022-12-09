const express = require('express')
const request = require("request-promise")
const es = require('../esClient')
const category = require('../../static/category')

const router = express.Router()
const config = process.env

router.post('/register_item', async (req, resp, next) => {
  if (category.default.category.indexOf(req.body.category) === -1) {
    return resp.status(400).json({ message: '存在しないカテゴリです' })
  }
  if (category.default.subcategory[category.default.category.indexOf(req.body.category)].indexOf(req.body.subcategory) === -1) {
    return resp.status(400).json({ message: '存在しないアイテムの種類です' })
  }
  if (req.body.name === null || req.body.name === "" || req.body.name === undefined) {
    return resp.status(400).json({ message: 'この名前は登録できません' })
  }
  //すでに登録されていないかチェック
  const check = await es.search({
    index: 'items',
    body: {
      query: {
        match: { 'name': req.body.name }
      }
    }
  })

  if (Number(check.body.hits.total['value']) !== 0) return resp.status(400).json({ message: 'すでに登録されているアイテムです' })

  const options = {
    method: 'POST',
    url: `http://${config.API_HOST}:${config.API_PORT}/items/_doc/`,
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

  request(options)
    .then(res => resp.json({ message: '登録しました' }))
    .catch(err => resp.status(400).json({ message: '失敗しました', error: err }))
    .finally(() => next())
})

module.exports = router

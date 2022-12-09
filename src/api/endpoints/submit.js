const express = require('express')
const request = require("request");
const category = require('../../static/category')

const router = express.Router()
const config = process.env

router.post('/submit', async (req, resp, next) => {
  if (req.body.name === null || req.body.name === undefined) {
    return resp.status(400).json({ message: 'アイテムが選択されていません' })
  }
  if ((Number(req.body.price) % 1000) !== 0) {
    return resp.status(400).json({ message: '値段の値が不正です' })
  }
  // if (category.default.subcategory[category.default.category.indexOf(req.body.category)].indexOf(req.body.subcategory) === -1) {
  //   return resp.status(400).json({ message: 'アイテムの種類が選択されていません' })
  // }

  //return resp.json({message: 'ok'})

  const options = {
    url: `http://${config.API_HOST}:${config.API_PORT}/price/_doc/`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    json: {
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      date: new Date()
    }
  }

  request.post(options, (err, res, body) => {
    if (err !== null) resp.status(400).json({ message: '失敗しました', error: err })
    resp.json({
      id: body._id,
      message: '登録しました',
      name: req.body.name,
      type: req.body.type,
      price: req.body.price
    })
  })

  // const check = await es.search({
  //   index: 'items',
  //   body: {
  //     query: {
  //       bool: {
  //         must: [
  //           { term: { 'name': req.body.name } },
  //           { term: { 'subcategory': req.body.type } }
  //         ]
  //       }
  //     }
  //   }
  // })
  //
  // if (Number(check.body.hits.total['value']) === 0) {
  //   return resp.status(400).json({ message: 'そのアイテムは存在しません' })
  // } else {
  //
  // }
/*    .then(res => {
      if (Number(res.body.hits.total['value']) === 0) {
        return resp.status(400).json({ message: 'そのアイテムは存在しません' })
      }
    })
    .catch(err => {
      return resp.status(400).send(err)
    })*/




})

module.exports = router

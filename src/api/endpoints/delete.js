const express = require('express')
const request = require("request");

const router = express.Router()
const config = process.env

router.post('/delete', (req, resp, next) => {
  const options = {
    url: `http://${config.API_HOST}:${config.API_PORT}/${req.body.index}/_doc/${req.body.id}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  request.delete(options, (err, res, body) => {
    if (JSON.parse(body).result === 'deleted') {
      return resp.json({ message: '削除しました' })
    } else return resp.status(400).json({ message: '失敗しました' })
  })
})

module.exports = router

const express = require('express')

// Create express instance
const app = express()

const apiRouter = require('./api')

app.use(apiRouter)

app.use(express.json())

const search = require('./endpoints/search')
app.use(search)

const submit = require('./endpoints/submit')
app.use(submit)

const register = require('./endpoints/register')
app.use(register)

const items = require('./endpoints/items')
app.use(items)

const deleteItem = require('./endpoints/delete')
app.use(deleteItem)

module.exports = {
  path: '/api',
  handler: app
}

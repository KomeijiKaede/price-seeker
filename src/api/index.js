import express, { NextFunction } from "express"

const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 80

const config = require('../../nuxt.config')
const apiRouter = require('./api')

app.set('port', port)

config.dev = !(process.env.NODE_ENV === 'production')

app.use('/', apiRouter)
async function start () {


  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  //app.listen(port, host)
}

// start()

module.exports = {
  path: '/api',
  handler: app
}

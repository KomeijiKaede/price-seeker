const { Client } = require('@elastic/elasticsearch')
const config = process.env
const client = new Client({
  host: `${config.API_HOST}:${config.API_PORT}`,
  node: `http://${config.API_HOST}:${config.API_PORT}`
})

module.exports = client

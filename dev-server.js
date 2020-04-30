/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000
app.use(require('serve-favicon')(path.join(__dirname + '/docs/favicon.ico')))
app.use(express.static(path.join(__dirname + '/docs/')))
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname + '/docs/index.html'))
)
app.listen(port, () => console.log(`running on http://localhost:${port}`))

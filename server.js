const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.static('public'))

app.get('/', (request, response) => {
})

app.listen(3000, () => {
  console.log('Palette Picker running on localhost:3000')
})


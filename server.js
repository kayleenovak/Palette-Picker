const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.static('public'))

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.put('/api/v1/project', (request, response) => {
  const project = request.body;

  for (let requiredParam of ['project']) {
    if(!project[requiredParam]) {
      return response.status(422)
        .send({error: `Expected format to create a new project is: { project: <String> }. You are missing a ${ requiredParam } property.`})
    }
  }

  database('projects').insert(project, 'id')
    .then(project => response.status(201).json({ id: project[0] }))
    .catch(error => response.status(500).json({ error }))
})

app.listen(3000, () => {
  console.log('Palette Picker running on localhost:3000')
})


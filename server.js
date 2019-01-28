const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use( bodyParser.json() );

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

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  for (let requiredParam of ['project']) {
    if(!project[requiredParam]) {
      return response.status(422)
        .send({error: `Expected format to create a new project is: { project: <String> }. You are missing a ${ requiredParam } property.`});
    }
  }

  database('projects').insert(project, 'id')
    .then(project => response.status(201).json({ id: project[0] }))
    .catch(error => response.status(500).json({ error }));
})

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  for (let requiredParam of ['name', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five', 'project_id']) {
    if(!palette[requiredParam]) {
      console.log(requiredParam)
      return response.status(422)
        .send({error: `Expected format to create a new project is: { name: <String> }. You are missing a ${ requiredParam } property.`})
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => response.status(201).json({ id: palette[0] }))
    .catch(error => response.status(500).json({ error }))
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const palette = request.param('id')
  database('palettes')
    .where('id', palette)
    .del()
  .then(palette => response.status(202).json({ id: palette[0]}))
  .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log('Palette Picker running on localhost:3000')
})


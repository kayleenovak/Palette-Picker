const environment = process.env.NODE_ENV || 'development'; //Declares the environment being used
const configuration = require('./knexfile')[environment]; //Imports only the environment from the knex file being utilized as declared on line one
const database = require('knex')(configuration); //when knex is required, it evaluates to a function, and then we call it immediately with the configuration which in this case is the development object
const express = require('express') //import express
const app = express() //instance of the express application
const bodyParser = require('body-parser'); //import body parser

app.use( bodyParser.json() ); // Telling the app to use the bodyparser so that it can correctly parse json objects

app.set('port', process.env.PORT || 3000) // Sets the port depending on the environment. If there is no environment set, it will default to 3000

app.use(express.static('public')) //tells the app where to start looking for static assets whenever there is a request to the server

app.get('/api/v1/projects', (request, response) => { // sets up a route handler for a get request on the defined path
  database('projects').select() //selects the projects table
    .then(projects => { 
      response.status(200).json(projects) // if the request is successful, then return a response with the status of 200, with the projects in the format of json
    })
    .catch(error => {
      response.status(500).json({error}) // if there is an error, catch the error and send a 500 response
    })
})

app.get('/api/v1/palettes', (request, response) => { // sets up a route handler for a get request on the defined path
  database('palettes').select() // select the palettes table in the database
    .then(palettes => {
      response.status(200).json(palettes) // if the request is successful send a response with the status of 200 and all the palettes in the db in the formet of json
    })
    .catch(error => {
      response.status(500).json({error}) // if there is an error, catch the error and send a 500 response
    })
})

app.post('/api/v1/projects', (request, response) => { // sets up a route handler for a post request on the defined path 
  const project = request.body; //assign the request body to the variable of project
  for (let requiredParam of ['project']) { //for each of the strings in the array...
    if(!project[requiredParam]) { //if the project variable does not have the property of the required parameter, then...
      return response.status(422) //return a response with the status of 422
        .send({error: `Expected format to create a new project is: { project: <String> }. You are missing a ${ requiredParam } property.`}); //also send an error with the string
    }
  }

  database('projects') //select the projects table in the database
  .insert(project, 'id') // insert a new record with the information described in the project variable and add an id
    .then(project => response.status(201).json({ id: project[0] })) // if the request is successful, then return a response with a status of 201, and the id of the project that was created
    .catch(error => response.status(500).json({ error })); // if there is an error, catch the error and send a 500 response
})

app.post('/api/v1/palettes', (request, response) => { // sets up a route handler for a post request on the defined path
  const palette = request.body; // assigns palette to the request body
  for (let requiredParam of ['name', 'color_one', 'color_two', 'color_three', 'color_four', 'color_five', 'project_id']) { //for each of the strings in the array
    if(!palette[requiredParam]) { //if the palette does not have the required param, then...
      return response.status(422) // return a response with the status of 422
        .send({error: `Expected format to create a new project is: { name: <String> }. You are missing a ${ requiredParam } property.`}) //send an error with a message
    }
  }

  database('palettes') //select the palettes table in the database
    .insert(palette, 'id') // insert a new record with the information decribed in the project variable and add an id
    .then(palette => response.status(201).json({ id: palette[0] })) // if the request is successful, send a response with a status of 201 and the is of the palette created
    .catch(error => response.status(500).json({ error })) // if there is an error, catch the error and send a 500 response
})

app.delete('/api/v1/palettes/:id', (request, response) => { // sets up a route handler for a delete request on the defined path
  const palette = request.param('id') // assigns palette to the request param that is an id
  database('palettes') // selects the palettes table in the database
    .where('id', palette) // find the corresponding entry where the 'id' is equal to the palette
    .del() // delete the matching entry
    .then(palette => response.status(202).json({ id: palette[0]})) // if the request is successful send a reponse with a status of 202 and the id of the palette deleted
    .catch(error => response.status(500).json({ error })) // if there is an error, catch the error and send a 500 response
})

app.listen(app.get('port'), () => { // tells the app to listen for the port that is defined
  console.log(`Palette Picker running on ${app.get('port')}`) // console log if the app is successfully running on the defined port
})



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project: 'This Project'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {name: 'Warm Colors', project_id: project[0], color_one: '#FFFFFF', color_two: '#000000', color_three: '#FFFFFF', color_four: '#000000', color_five: '#FFFFFF'}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};

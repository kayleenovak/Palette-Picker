generateNewPalette = () => {
  let paletteColors = []
  for (let i = 0; i < 5; i++) {
    const frozenColor = freezeColor(i)
    if(frozenColor === false) {
      paletteColors[i] = generateHexCode()
    } else {
      const colors = $('.color')
      paletteColors[i] = convertRGBToHex(colors[i].style.background)
    }
  }
  updatePaletteColors(paletteColors)
  updateHexCodes(paletteColors)
}

generateHexCode = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let hexCode = ''
  for (let i = 0; i < 6; i++) {
    const randomCharacter = Math.floor(Math.random() * letters.length)
    hexCode = hexCode.concat(letters[randomCharacter])
  }
  return hexCode
}

updatePaletteColors = (paletteColors) => {
  $('.color').each((i, element) => {
    element.style.background = `#${paletteColors[i]}`
  })
}

updateHexCodes = (paletteColors) => {
  $('.hex-code').each((i, element) => {
    element.innerText = `#${paletteColors[i]}`
  })
}

toggleLock = (e) => {
  if($(e.target).hasClass('unlock-img')) {
    $(e.target).removeClass('unlock-img')
    $(e.target).addClass('lock-img')
  } else {
    $(e.target).removeClass('lock-img')
    $(e.target).addClass('unlock-img')  
  }
}

freezeColor = (i) => {
  const locks = $('.lock')
  if(locks[i].classList.contains('unlock-img')) {
    return false
  } else {
    return true
  }
}

convertToHex = (color) => {
  const hexColor = parseInt(color).toString(16);
  let hexColorCode
  if (hexColor.length === 1) {
    hexColorCode = '0' + hexColor
  } else {
    hexColorCode = hexColor
  }
  return hexColorCode.toUpperCase()
}

convertRGBToHex = (rgb) => {
  const splitRgb = splitRGB(rgb)
  const hexCode = convertToHex(splitRgb[1]) + convertToHex(splitRgb[2]) + convertToHex(splitRgb[3])
  return hexCode
}

splitRGB = (string) => {
  const newString = string.replace('(', ',').replace(')', '').split(',')
  return newString
}

createNewProject = async (e) => {
  e.preventDefault()
  const projectName = $('.name-project-input').val()
  saveProjectToDb(projectName)
  updateProjectSelections()
}

saveProjectToDb = async (projectName) => {
  const project = { 
    project: projectName
  }
  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  })
  const id = await response.json()
  await appendProject(projectName, id.id)
}

appendProject = (name, id) => {
  const newProject = `<section id='${id}' class="project">
                        <h5 class="project-name">${name}</h5>
                      </section>`
  $('.projects').append(newProject)
  updateProjectSelections()
}

savePalette = async (e) => {
  e.preventDefault()
  const paletteName = $('.name-palette-input').val()
  const colors = $('.hex-code')
  const hexCodes = [$(colors[0]).text(), $(colors[1]).text(), $(colors[2]).text(), $(colors[3]).text(), $(colors[4]).text()]
  const selectedProject = $('.select-project option:selected').text()
  const projectId = findProjectId(selectedProject)
  const paletteId = await savePaletteToDb(paletteName, hexCodes, projectId)
  appendPalette(hexCodes, paletteName, selectedProject, paletteId)
}

savePaletteToDb = async (name, colors, id) => {
  const palette = {
    name: name,
    color_one: colors[0],
    color_two: colors[1],
    color_three: colors[2],
    color_four: colors[3],
    color_five: colors[4],
    project_id: id
  }
  const response = await fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(palette)
  })
  const savedPalette = await response.json()
  return savedPalette.id
}

const appendPalette = (colors, name, selectedProject, id) => {
  const savedPalette = `<article class="color-container" id=${id}>
      <h6 class="palette-name">${name}</h6>
      <div class='project-color' style='background: ${colors[0]}'></div>
      <div class='project-color' style='background: ${colors[1]}'></div>
      <div class='project-color' style='background: ${colors[2]}'></div>
      <div class='project-color' style='background: ${colors[3]}'></div>
      <div class='project-color' style='background: ${colors[4]}'></div>
      <img src='./images/delete.svg' class="delete-palette-btn"/>
    </article>`
  const projects = $('.project-name')
  $('.project-name').each((i, element) => {
    if ($(element).text() === selectedProject) {
      $(element).parent().append(savedPalette)
    }
  })
}

const findProjectId = (selectedProject) => {
  const projects = $('.project-name')
  let id
  $('.project-name').each((i, element) => {
    if ($(element).text() === selectedProject) {
      id = $(element).parent().attr('id')
    }
  })
  return id
}

updateProjectSelections = () => {
  const projectNames = $('.project-name')
  projectNames.each((i, element) => {
    const newOption = `<option value=${$(element).text()}>${$(element).text()}</option>`
    $('.select-project').append(newOption)
  })
}

displayProjectColors = (e) => {
  const rgbCodes = []
  if (e.target.classList.contains('project-name') || e.target.classList.contains('project-color')) {
    const children = $(e.target).parent().children('div')
    children.each((i, element) => {
      rgbCodes.push(element.style.background)
    })
    const hexCodes = []
    for(let i = 0; i < 5; i++) {
      hexCodes.push(convertRGBToHex(rgbCodes[i]))
    }
    updatePaletteColors(hexCodes)
    updateHexCodes(hexCodes)
  }
}

const fetchPalettes = async () => {
  try {
    const response = await fetch('/api/v1/palettes')
    const palettes = await response.json()
    return palettes
  } catch (error) {

  }
}

const fetchProjects = async () => {
  try {
    const palettes = await fetchPalettes()
    const response = await fetch('/api/v1/projects')
    const projects = await response.json()
    appendSavedProjects(projects, palettes)
  } catch (error) {

  }
}

const deletePalette = async (e) => {
  if(e.target.classList.contains('delete-palette-btn')) {
    const id = $(e.target).parent().attr('id')
    const palette = {
      id
    }
    try {
      const response = await fetch(`/api/v1/palettes/${id}`, 
      {
        method: 'DELETE',
        body: JSON.stringify(palette)
      })
      $(e.target).parent().remove()
    } catch (error) {
      
    }
}
}

const appendSavedProjects = (projects, palettes) => {
  projects.forEach(project => {
    appendProject(project.project, project.id)
    const matchingPalettes = palettes.filter(palette => {
      return palette.project_id === project.id
    }).forEach(palette => {
      const colors = [palette.color_one, palette.color_two, palette.color_three, palette.color_four, palette.color_five]
      appendPalette(colors, palette.name, project.project, palette.id)
    })
  })
}

const checkInputs = (e) => {
  if($(e.target).val() === '') {
    $(e.target).next().prop('disabled', true)
  } else {
    $(e.target).next().prop('disabled', false)
  }
}

generateNewPalette()
fetchProjects()

$('.generate-palette-btn').on('click', generateNewPalette)
$('.unlock-img').on('click', toggleLock)
$('.create-project-btn').on('click', createNewProject)
$('.save-palette-btn').on('click', savePalette)
$('.projects').on('click', displayProjectColors)
$('.projects').on('click', deletePalette)
$('.name-project-input').on('keyup', checkInputs)
$('.name-palette-input').on('keyup', checkInputs)

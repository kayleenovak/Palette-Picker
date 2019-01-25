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
  const id = await saveProjectToDb(projectName)
  appendProject(projectName, id)
  updateProjectSelections()
}

saveProjectToDb = async (projectName) => {
  const project = { 
    project: projectName
  }
  const response = await fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  })
  const id = await response.json()
  return id
}

appendProject = (name, id) => {
  const newProject = `<section id=${id.id} class="project">
      <h5 class="project-name">${name}</h5>
    </section>`
  $('.projects').append(newProject)
  updateProjectSelections()
}

savePalette = (e) => {
  e.preventDefault()
  const paletteName = $('.name-palette-input').val()
  const colors = $('.hex-code')
  const hexCodes = [$(colors[0]).text(), $(colors[1]).text(), $(colors[2]).text(), $(colors[3]).text(), $(colors[4]).text()]
  const selectedProject = $('.select-project option:selected').text()
  appendPalette(hexCodes, paletteName, selectedProject)
  savePaletteToDb(paletteName, hexCodes)
}

savePaletteToDb = async (name, colors) => {
  const palettes = {
    name: name,
    color_one: colors[0],
    color_two: colors[1],
    color_three: colors[2],
    color_four: colors[3],
    color_five: colors[4]
  }
  const response = await fetch('http://localhost:3000/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(project)
  })
}

const appendPalette = (colors, name, selectedProject) => {
  const savedPalette = `<article class="color-container">
      <h6 class="palette-name" id=${name}>${name}</h6>
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
  }
  const hexCodes = []
  for(let i = 0; i < 5; i++) {
    hexCodes.push(convertRGBToHex(rgbCodes[i]))
  }
  updatePaletteColors(hexCodes)
  updateHexCodes(hexCodes)
}

const fetchPalettes = async () => {
  const response = await fetch('http://localhost:3000/api/v1/palettes')
  const palettes = await response.json()
  return palettes
}

const fetchProjects = async () => {
  const palettes = await fetchPalettes()
  const response = await fetch('http://localhost:3000/api/v1/projects')
  const projects = await response.json()
  appendSavedProjects(projects, palettes)
}

const appendSavedProjects = (projects, palettes) => {
  projects.forEach(project => {
    appendProject(project.project)
    const matchingPalettes = palettes.filter(palette => {
      return palette.project_id === project.id
    }).forEach(palette => {
      const colors = [palette.color_one, palette.color_two, palette.color_three, palette.color_four, palette.color_five]
      appendPalette(colors, palette.name, project.project)
    })
  })
}

generateNewPalette()
fetchProjects()

$('.generate-palette-btn').on('click', generateNewPalette)
$('.unlock-img').on('click', toggleLock)
$('.create-project-btn').on('click', createNewProject)
$('.save-palette-btn').on('click', savePalette)
$('.projects').on('click', displayProjectColors)

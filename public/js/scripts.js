$('.generate-palette-btn').on('click', generateNewPalette)
$('.unlock-img').on('click', toggleLock)
$('.create-project-btn').on('click', createNewProject)
$('.save-palette-btn').on('click', savePalette)
$('.projects').on('click', displayProjectColors)

generateNewPalette()

function generateNewPalette() {
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

function generateHexCode() {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let hexCode = ''
  for (let i = 0; i < 6; i++) {
    const randomCharacter = Math.floor(Math.random() * letters.length)
    hexCode = hexCode.concat(letters[randomCharacter])
  }
  return hexCode
}

function updatePaletteColors(paletteColors) {
  $('.color').each(function(i) {
    this.style.background = `#${paletteColors[i]}`
  })
}

function updateHexCodes(paletteColors) {
  $('.hex-code').each(function(index) {
    this.innerText = `#${paletteColors[index]}`
  })
}

function toggleLock(e) {
  if($(e.target).hasClass('unlock-img')) {
    $(e.target).removeClass('unlock-img')
    $(e.target).addClass('lock-img')
  } else {
    $(e.target).removeClass('lock-img')
    $(e.target).addClass('unlock-img')  
  }
}

function freezeColor(i) {
  const locks = $('.lock')
  if(locks[i].classList.contains('unlock-img')) {
    return false
  } else {
    return true
  }
}

function convertToHex(color) {
  const hexColor = parseInt(color).toString(16);
  let hexColorCode
  if (hexColor.length === 1) {
    hexColorCode = '0' + hexColor
  } else {
    hexColorCode = hexColor
  }
  return hexColorCode.toUpperCase()
}

function convertRGBToHex(rgb) {
  const splitRgb = splitRGB(rgb)
  const hexCode = convertToHex(splitRgb[1]) + convertToHex(splitRgb[2]) + convertToHex(splitRgb[3])
  return hexCode
}

function splitRGB(string) {
  const newString = string.replace('(', ',').replace(')', '').split(',')
  return newString
}

function createNewProject(e) {
  e.preventDefault()
  const projectName = $('.name-project-input').val()
  const newProject = `<section class="project">
      <h5 class="project-name">${projectName}</h5>
    </section>`
  $('.projects').append(newProject)
  updateProjectSelections()
}

function savePalette(e) {
  e.preventDefault()
  const paletteName = $('.name-palette-input').val()
  const colors = $('.hex-code')
  const savedPalette = `<article class="color-container">
      <h6 class="palette-name" id=${paletteName}>${paletteName}</h6>
      <div class='project-color' style='background: ${$(colors[0]).text()}'></div>
      <div class='project-color' style='background: ${$(colors[1]).text()}'></div>
      <div class='project-color' style='background: ${$(colors[2]).text()}'></div>
      <div class='project-color' style='background: ${$(colors[3]).text()}'></div>
      <div class='project-color' style='background: ${$(colors[4]).text()}'></div>
      <img src='./images/delete.svg' class="delete-palette-btn"/>
    </article>`
  const selectedProject = $('.select-project option:selected').text()
  $('.project-name').each(function() {
    if ($(this).text() === selectedProject) {
      $(this).parent().append(savedPalette)
    }
  })
}

function updateProjectSelections() {
  const projectNames = $('.project-name')
  projectNames.each(function(i) {
    const newOption = `<option value=${$(this).text()}>${$(this).text()}</option>`
    $('.select-project').append(newOption)
  })
}

function displayProjectColors(e) {
  const rgbCodes = []
  if (e.target.classList.contains('project-name') || e.target.classList.contains('project-color')) {
    const children = $(e.target).parent().children('div')
    children.each(function() {
      rgbCodes.push(this.style.background)
    })
  }
  const hexCodes = []
  for(let i = 0; i < 5; i++) {
    hexCodes.push(convertRGBToHex(rgbCodes[i]))
  }
  updatePaletteColors(hexCodes)
}
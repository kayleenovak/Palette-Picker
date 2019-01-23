$('.generate-palette-btn').on('click', generateNewPalette)
$('.unlock-img').on('click', toggleLock)

generateNewPalette()

function generateNewPalette() {
  let paletteColors = []
  for (let i = 0; i < 5; i++) {
    const hexCode = generateHexCode()
    const frozenColor = freezeColor(i)
    if(frozenColor === false) {
      paletteColors[i] = hexCode
    } else {
      const colors = $('.color')
      console.log(colors[i])
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
    console.log(paletteColors)
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
  console.log(locks[i].classList.contains('unlock-img'))
  if(locks[i].classList.contains('unlock-img')) {
    return false
  } else {
    return true
  }
}

function convertToHex(color) {
  const hexColor = parseInt(color).toString(16);
  console.log(color, hexColor)
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

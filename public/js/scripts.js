$('.generate-palette-btn').on('click', generateNewPalette)
$('.unlock-img').on('click', toggleLock)

generateNewPalette()

function generateNewPalette() {
  let paletteColors = []
  for (let i = 0; i < 5; i++) {
    const hexCode = generateHexCode()
    const frozenColor = freezeColor(i)
    if(frozenColor === false) {
      paletteColors.push(hexCode)
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
  if($(locks[i]).hasClass('unlock-img')) {
    return false
  } else {
    return true
  }
}

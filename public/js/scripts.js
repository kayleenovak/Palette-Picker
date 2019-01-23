$('.generate-palette-btn').on('click', generateNewPalette)

function generateNewPalette() {
  let paletteColors = []
  for (let i = 0; i < 5; i++) {
    const hexCode = generateHexCode()
    paletteColors.push(hexCode)
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
  $('.color').each(function(index) {
    this.style.background = `#${paletteColors[index]}`
  })
}

function updateHexCodes(paletteColors) {
  $('.hex-code').each(function(index) {
    this.innerText = `#${paletteColors[index]}`
  })
}


const generateNewPalette = () => {
  let paletteColors = []
  for (let i = 0; i < 5; i++) {
    const hexCode = generateHexCode()
    paletteColors.push(hexCode)
  }
  console.log(paletteColors)
}

const generateHexCode = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let hexCode = ''
  for (let i = 0; i < 6; i++) {
    const randomCharacter = Math.floor(Math.random() * letters.length)
    hexCode = hexCode.concat(letters[randomCharacter])
  }
  console.log(hexCode)
  return hexCode
}

$('.generate-palette-btn').on('click', generateNewPalette)
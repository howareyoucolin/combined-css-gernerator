const { outputCombinedCss } = require('./action.css')

const action = process.argv[2]

switch (action) {
    case 'css':
        outputCombinedCss(process.argv[3])
        break
    default:
        break
}

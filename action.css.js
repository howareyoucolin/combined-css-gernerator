const { getCssListFromHtml, getCombinedCssCode, getMinifiedCss } = require('./lib')
const fs = require('fs')
const { whiteBright, greenBright } = require('console-log-colors')

const outputCombinedCss = async function (source) {
    const cssFiles = await getCssListFromHtml(source)
    console.log(greenBright('Merging the css files ...'))
    console.log(whiteBright(cssFiles.join('\n')))

    const combinedCss = await getCombinedCssCode(cssFiles)
    const minifiedCss = await getMinifiedCss(combinedCss)

    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist')
    }

    const filename = source.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    fs.writeFile(`dist/${filename}.css`, minifiedCss, function (err) {
        if (err) throw err
        console.log(greenBright(`The css file dist/${filename}.css is successfully generated!`))
        console.log('')
    })
}

module.exports = {
    outputCombinedCss,
}

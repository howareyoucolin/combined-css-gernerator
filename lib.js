const fs = require('fs')
const jsdom = require('jsdom')
const http = require('http')
const https = require('https')

/**
 * Check if its a local file or external url
 * @param {string} path
 * @returns {boolean}
 */
const _isLocalFile = function (path) {
    if (path.length < 5) return false
    return path.substring(0, 4) !== 'http'
}

/**
 * Get HTML script from local file
 * @param {string} path
 * @returns {string}
 */
const _getLocalFileHtml = function (path) {
    return fs.readFileSync(path, 'utf8')
}

/**
 * Get HTML script from external url
 * @param {string} url
 * @returns {string}
 */
const _getExternalContent = function (url) {
    return new Promise((resolve, reject) => {
        let client = http
        if (url.toString().indexOf('https') === 0) {
            client = https
        }
        client
            .get(url, (resp) => {
                let data = ''
                resp.on('data', (chunk) => {
                    data += chunk
                })
                resp.on('end', () => {
                    resolve(data)
                })
            })
            .on('error', (err) => {
                reject(err)
            })
    })
}

/**
 * Get all the css file links from the html file
 * @param {string} url
 * @returns {string[]}
 */
const getCssListFromHtml = async function (url) {
    const cssList = []
    const html = _isLocalFile(url) ? _getLocalFileHtml(url) : await _getExternalContent(url)
    const dom = new jsdom.JSDOM(html)
    dom.window.document.querySelectorAll('link').forEach(function (element) {
        cssList.push(element.href)
    })
    return cssList
}

/**
 * Merge all css file into one single large string
 * @param {string} url
 * @returns {string}
 */
const getCombinedCssCode = async function (cssFiles) {
    let result = ''
    for (let i = 0; i < cssFiles.length; i++) {
        const file = cssFiles[i]
        const cssCode = await _getExternalContent(file)
        result += cssCode + '\n'
    }
    return result
}

/**
 * Minify css code
 * @param {string} csscode
 * @returns {string}
 */
const getMinifiedCss = async function (input) {
    var CleanCSS = require('clean-css')
    var options = { format: 'keep-breaks' }
    return new CleanCSS(options).minify(input).styles
}

module.exports = {
    getCssListFromHtml,
    getCombinedCssCode,
    getMinifiedCss,
}

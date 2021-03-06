const path = require('path')

module.exports = {
    resolve : {
        modules : [
            path.resolve('./lib'),
            path.resolve('./node_modules')
        ]
    },
    entry   : './lib/renderers/dom.js',
    output  : {
        path     : path.resolve(__dirname, 'public'),
        filename : 'bundle.js'
    },
    module  : {
        rules : [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader' }
        ]
    }
}

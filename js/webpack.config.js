const path = require('path');

module.exports = {
    entry: './js/empHome.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
};
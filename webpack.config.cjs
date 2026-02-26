const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        webf: './src/index.js',
        dom: './src/dom.js',
        mouse: './src/Mouse.js',
        eventDispatcher: './src/eventDispatcher.js',
        Translator: './src/Translator.js',
    },
    output: {
        filename: '[name].umd.js',
        path: path.resolve(__dirname, 'dist/umd'),
        library: {
            name: ['[name]'],
            type: 'umd',
        },
        globalObject: 'this',
        publicPath: '/dist/',
        clean: true
    },
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
}

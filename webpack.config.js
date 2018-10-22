var path = require('path');

module.exports = {
  entry: './src/index.js',

  mode: 'production',

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-global-event-listener.js',
    library: 'react-global-event-listener',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    },
    react: 'react'
  }
};

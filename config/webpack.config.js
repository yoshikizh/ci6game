const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
  target: 'web',
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'ci6game.production.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }, 
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
};

module.exports = config;


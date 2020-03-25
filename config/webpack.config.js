const HtmlWebpackPlugin = require('html-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');
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
          { loader: "style-loader" },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
        ]
      }, 
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.json5$/,
        loader: 'json5-loader'
      },
      {
        test: /(\.jsx|\.js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        }
      }
    ],
  },
  resolve: {
    extensions: [".js", ".jsx",".json"]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new Uglify({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    })
  ],
};

module.exports = config;


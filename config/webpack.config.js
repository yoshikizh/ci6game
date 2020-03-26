const HtmlWebpackPlugin = require('html-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV;
const isDev = env === "development";

const config = {
  target: 'web',
  entry: {
    libs: ['./libs/pixi.js'],
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use:[
            {
              loader:"css-loader",
              options: {
                url: false,
                sourceMap: true
              }
            }
          ]
        })
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
    new HtmlWebpackPlugin({
      template: isDev ? 'src/templates/index.html' : 'src/templates/index.prod.html',
    }),
    new ExtractTextPlugin("stylesheets.css"),
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


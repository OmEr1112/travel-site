const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "style.css"
});

module.exports = {
  mode: 'production',
  entry: {
      script: './index.js'
  },
  output: {
      path: path.resolve(__dirname, "./docs"),
      filename: "[name].js",
      publicPath: './'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {

    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{ 
              loader: 'css-loader',
              options: {
                  importLoaders: 2
              }
            },
            { 
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('autoprefixer')(),
                  require('cssnano')()
                ]
              }       
            },
            {
             loader: 'sass-loader',
             
            }        
          ]
        })
      },
      {
      test: /\.(html)$/,
        use: {
          loader: 'html-loader',
            options: {
              //attrs: ['img:src', 'picture:srcset', 'img:srcset'],
              minimize: true,
              html5: true,
              conservativeCollapse: false,
              preserveLineBreaks: false,
              minifyJS: false,
              minifyCSS: false,
              removeScriptTypeAttributes: false,
              removeStyleTypeAttributes: false
            }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              // webp: {
              //   quality: 75
              // }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      template: './app/index.html'
    }),
    new CopyWebpackPlugin([{
        from: 'app/images',
        to: 'images',
        //test: /.*\.mp4|webm$/   
    }]),
    // new CopyWebpackPlugin([{
    //     from: 'app/css',
    //     to: 'css',
    //     //test: /.*\.mp4|webm$/   
    // }])
  ]
};

// fallback: 'style-loader',
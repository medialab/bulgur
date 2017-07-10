
var webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      { 
        test: /\.(csv|gexf|svgm)$/, 
        loader: 'raw-loader' 
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        // use: [
        //     'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        //     'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        // ]
         use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name:'assets/[name].[ext]'
              }
            }
          },
        {
          loader: 'image-webpack-loader',
          options: {
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: true,
              },
              optipng: {
                optimizationLevel: 7,
              }
            }
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // new webpack.optimize.UglifyJsPlugin()
  ]
};

// module.exports = {
//   module: {
//     loaders: [
//       {
//         test: /\.(jpe?g|png|gif|svg)$/i,
//         loaders: [
//             'file?hash=sha512&digest=hex&name=[hash].[ext]',
//             'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
//         ]
//       },
//       { 
//         test: /\.(csv|gexf|svgm)$/, 
//         loader: 'raw-loader' 
//       },
//       {
//         test: /\.scss$/,
//         loaders: ['style', 'css', 'sass']
//       },
//       {
//         test: /\.css$/,
//         loaders: ['style', 'css']
//       }
//     ]
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: JSON.stringify('production')
//       }
//     }),
//     // new webpack.optimize.UglifyJsPlugin()
//   ]
// };

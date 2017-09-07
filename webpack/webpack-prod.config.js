const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: ['babel-polyfill', './client/index.js'],
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash]-[chunkhash].js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      { test: /\.jsx$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/ },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?modules&importLoaders=1&localIdentName=[local]', 'sass-loader', 'autoprefixer-loader?browsers=last 4 version']
        })
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([path.resolve('dist')], { root: path.resolve(__dirname, '../') }),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
    HtmlWebpackPluginConfig,
    // optimizations
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        env: '"production"',
        NODE_ENV: '"production"',
      }
    })
  ]
};

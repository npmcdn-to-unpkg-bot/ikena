var webpack = require('webpack');

module.exports = {
  entry: '../public/js/components/main.jsx',

  output: {
    filename: 'bundle.js',
    publicPath: '../public'
  },

  module: {
    loaders: [
      {
        // Test for js or jsx files.
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader", 
        query:
          {
            presets: [
              'babel-preset-es2015',
              'babel-preset-react',
            ].map(require.resolve),
          }
      }
    ]
  },
  externals: {
    // Don't bundle the 'react' npm package with the component.
    'react': 'React' 
  },
  resolve: {
    // Include empty string '' to resolve files by their explicit extension
    // (e.g. require('./somefile.ext')).
    // Include '.js', '.jsx' to resolve files by these implicit extensions
    // (e.g. require('underscore')).
    extensions: ['', '.js', '.jsx']
  }
}
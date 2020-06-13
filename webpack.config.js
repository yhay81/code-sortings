const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: { path: `${__dirname}/docs`, filename: 'main.js' },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /(node_modules|\.webpack)/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
      {
        test: /\.styl$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
      },
    ],
  },
  resolve: { extensions: ['.ts', '.js', '.css'] },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.pug' }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ],
}

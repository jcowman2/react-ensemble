const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    bundle: ["./src/index.ts"]
  },
  externals: [
    nodeExternals({
      additionalModuleDirs: ["../../node_modules"]
    })
  ],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index.js",
    libraryTarget: "commonjs"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.{ts,tsx,js,jsx}"
      }
    })
  ]
};

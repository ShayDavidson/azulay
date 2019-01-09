const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StatefulReactContainerPlugin = require("stateful-react-container-webpack-plugin");

module.exports = function(env) {
  return {
    devtool: env === "production" ? "source-map" : "cheap-eval-source-map",
    entry: "./src/index.js",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "public")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /(node_modules)/
        },
        {
          test: /\.json$/,
          use: "json-loader"
        },
        {
          test: /\.css$/,
          use: "css-loader"
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|mp3|wav)$/,
          loader: "url-loader",
          options: {
            limit: 10000
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Azulay",
        inject: false,
        template: require("html-webpack-template"),
        favicon: path.resolve(__dirname, "src/assets") + "/favicon.png",
        googleAnalytics: {
          trackingId: "UA-57428971-3",
          pageViewOnLoad: true
        }
      }),
      new StatefulReactContainerPlugin({ noState: true })
    ]
  };
};

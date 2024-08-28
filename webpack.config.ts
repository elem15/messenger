import path from "node:path"
import HtmlWebpackPlugin from  "html-webpack-plugin"
import  webpack from "webpack"
import { Configuration as DevServerConfiguration } from "webpack-dev-server"
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const { ModuleFederationPlugin } = require('webpack').container;
import PreactRefreshPlugin from '@prefresh/webpack';

type Mode = "development" | "production"

interface envVariables {
  mode: Mode
  PORT: number
}

export default (env: envVariables) => {
  const isDev = env.mode === "development";
  const isProd = env.mode === "production";

  const config: webpack.Configuration = {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    optimization: {
      runtimeChunk: "single",
    },
    plugins: [
      new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html')}),
      isProd && new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      }),
      new PreactRefreshPlugin(),
      new ModuleFederationPlugin({
        name: "messenger_app",
        library: { type: 'var', name: "messenger_app" },
        filename: 'remoteEntry.js',
        exposes: {
          './MessengerBlock': './src/components/Messenger',
          './usersRemoteApi': './src/app/api/users/usersApi.ts',
          './messengerApi': './src/app/api/messenger/messengerApi.ts',
        },
        shared: {
          react: {
            singleton: true,
            version: '0',
            requiredVersion: false,
          },
          'react-dom': {
            requiredVersion: false,
            singleton: true,
            version: '0',
          },
          'react-redux': {
            requiredVersion: false,
            singleton: true,
            version: '0',
          },
          'react-time-ago': {
            requiredVersion: false,
            singleton: true,
            version: '0',
          }
        },
      })
    ],
    module: {
      rules: [
        {
          test: /\.(scss|css)$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                esModule: false,
                modules: {
                  mode: "local",
                  auto: true,
                  localIdentName: isDev ? '[local]--[hash:base64:8]' : '[hash:base64]',
                },
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  parser: "postcss",
                  plugins: [
                    'tailwindcss',
                    'autoprefixer',
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.scss'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    devtool: isDev && "inline-source-map",
    devServer: isDev ? {
      port: env.PORT ?? 3001,
      open: true
    } : undefined,
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: "[name].[contenthash].js",
      clean: true
    },
  }
  return config
}
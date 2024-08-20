import path from "node:path"
import HtmlWebpackPlugin from  "html-webpack-plugin"
import  webpack from "webpack"
import { Configuration as DevServerConfiguration } from "webpack-dev-server"
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { dependencies as deps } from './package.json'
import {ModuleFederationPlugin} from "@module-federation/enhanced";

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
    plugins: [
      new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html')}),
      isProd && new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css",
      }),
      new ModuleFederationPlugin({
        name: "messenger_app",
        library: { type: 'var', name: "messenger_app" },
        filename: 'remoteEntry.js',
        exposes: {
          './MessengerBlock': './src/components/Messenger',
        },
        shared: {
          ...deps,
          react: {
            eager: true,
            import: 'react',
            shareKey: 'shared-react',
            shareScope: 'default-react',
            requiredVersion: deps.react,
            singleton: true,
          },
          'react-dom': {
            eager: true,
            import: 'react-dom',
            shareKey: 'shared-react-dom',
            shareScope: 'default-react-dom',
            requiredVersion: deps['react-dom'],
            singleton: true,
          },
          'react-router-dom': {
            eager: true,
            import: 'react-router-dom',
            shareKey: 'shared-react-router-dom',
            shareScope: 'default-react-router-dom',
            requiredVersion: deps['react-router-dom'],
            singleton: true,
          },
          'react-redux': {
            import: 'react-redux',
            shareKey: 'react-redux',
            shareScope: 'default-react-redux',
            requiredVersion: deps['react-redux'],
            singleton: true,
          },
          '@radix-ui/react-scroll-area': {
            eager: true,
            requiredVersion: deps["@radix-ui/react-scroll-area"],
            singleton: true,
          },
          'react-time-ago': {
            import: 'react-time-ago',
            shareKey: 'react-time-ago',
            shareScope: 'default-react-time-ago',
            eager: true,
            requiredVersion: deps["react-time-ago"],
            singleton: true,
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
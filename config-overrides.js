const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const { name, dependencies: deps } = require('./package.json');

const addPlugins = (config) => {
  config.plugins.unshift(
    new ModuleFederationPlugin({
      name,
      shared: {
        ...deps,
        react: {
          eager: true,
          requiredVersion: "^18.2.0",
          singleton: true,
        },
        'react-dom': {
          eager: true,
          requiredVersion: "^18.2.0",
          singleton: true,
        },
        'react-redux': {
          eager: true,
          requiredVersion: "^9.1.2",
          singleton: true,
        },
        'react-scripts': {
          eager: true,
          requiredVersion: "5.0.1",
          singleton: true,
        },
        '@reduxjs/toolkit': {
          eager: true,
          requiredVersion: "^2.2.7",
          singleton: true,
        }
      },
      filename: 'remoteEntry.js',
      exposes: {
        './MessangerBlock': './src/components/Messanger',
      },
    })
  );
  return config;
};

module.exports = (config) => {
  const mode = process.env.NODE_ENV || 'development';
  let publicPath = `//${process.env.HOST}:${process.env.PORT}/`;
  config.output.publicPath = publicPath;
  config.mode = mode;

  config.resolve = {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  };

  return addPlugins(config);
};

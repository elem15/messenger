const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const { name, dependencies: deps } = require('./package.json');

const addPlugins = (config) => {
  config.output.unshift(
    {
      publicPath: 'auto'
    }
  )
  config.plugins.unshift(
    new ModuleFederationPlugin({
      name,
      shared: {
        ...deps,
        react: {
          eager: true,
          requiredVersion: deps['react'],
          singleton: true,
        },
        'react-dom': {
          eager: true,
          requiredVersion: deps['react-dom'],
          singleton: true,
        },
        'react-redux': {
          eager: true,
          requiredVersion: deps['react-redux'],
          singleton: true,
        },
        'react-router-dom': {
          eager: true,
          requiredVersion: deps['react-router-dom'],
          singleton: true,
        },
        'react-scripts': {
          eager: true,
          requiredVersion: deps['react-scripts'],
          singleton: true,
        }
      },
      filename: 'remoteEntry.js',
      exposes: {
        './MessengerBlock': './src/components/Messenger',
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

  return addPlugins(config);
};

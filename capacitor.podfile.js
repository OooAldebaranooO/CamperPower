const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function (config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      contents = contents.replace('use_modular_headers!', '');
      if (!contents.includes('use_frameworks!')) {
        contents = contents.replace('platform :ios', 'use_frameworks! :linkage => :static\nplatform :ios');
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);
};
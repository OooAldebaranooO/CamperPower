const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function (config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');
      console.log('=== PODFILE AVANT MODIFICATION ===');
      console.log(contents);
      contents = contents.replace('use_modular_headers!', '');
      if (!contents.includes('use_frameworks!')) {
        contents = contents.replace('platform :ios', 'use_frameworks! :linkage => :static\nplatform :ios');
      }
      console.log('=== PODFILE APRES MODIFICATION ===');
      console.log(contents);
      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
};
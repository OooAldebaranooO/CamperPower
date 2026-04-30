module.exports = function (api) {
  api.modifyPodfile(({ contents }) => {
    return contents.replace(
      'platform :ios',
      'use_modular_headers!\nplatform :ios'
    );
  });
};
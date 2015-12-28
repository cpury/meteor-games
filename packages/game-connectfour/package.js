Package.describe({
  name: 'cpury:game-connectfour',
  version: '0.0.1',
  summary: 'Implementation of the Connect Four game'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'mongo',
    'cpury:game-base'
  ]);

  api.addFiles([
    'logic.js',
    'ai.js',
  ], 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cpury:game-connectfour');
  api.addFiles('tests.js');
});

Package.describe({
  name: 'cpury:game-ticktacktoe',
  version: '0.0.1',
  summary: 'Implementation of the Tick Tack Toe game'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'mongo',
    'cpury:game-base'
  ]);

  api.addFiles('logic.js');

  api.addFiles([
    'ai.js',
  ], 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cpury:game-ticktacktoe');
  api.addFiles('game-ticktacktoe-tests.js');
});

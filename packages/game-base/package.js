Package.describe({
  name: 'cpury:game-base',
  version: '0.0.1',
  summary: 'Abstract base package for games within Meteor Games'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'mongo'
  ]);

  api.addFiles([
    'game-base.js',
    'collections.js',
    'methods.js'
  ]);

  api.addFiles(['server.js'], 'server');

  api.export(['GameInstances', 'Games', 'gameLogics', 'gameAis']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cpury:game-base');
  api.addFiles('game-base-tests.js');
});

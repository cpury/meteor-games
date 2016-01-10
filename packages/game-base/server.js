// Defines publications and indexes etc.

Meteor.startup(function () {
  // Ensure our DB is indexed
  GameInstances._ensureIndex({"gameId": 1});
  Games._ensureIndex({"gameId": 1});
});

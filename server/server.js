Meteor.startup(function () {
  // Ideas._ensureIndex({"authorId": 1});
  // Ideas._ensureIndex({"upvotes": 1});
  // Ideas._ensureIndex({"comments.authorId": 1});
  // Ideas._ensureIndex({"comments.upvotes": 1});
  // Ideas._ensureIndex({"title": 1, "projectId": 1}, {unique: true});

  // Projects._ensureIndex({"authorId": 1});
  // Projects._ensureIndex({"active": 1});
  // Projects._ensureIndex({"private": 1});
  // Projects._ensureIndex({"title": 1}, {unique: true});
});

Meteor.publish("gameInstances", function () {
  return GameInstances.find({});
});

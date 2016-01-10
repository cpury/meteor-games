Template.nav.onCreated(function () {
  var self = this;

  // Subscribe to the number of active instances by the player
  self.autorun(function () {
    self.subscribe("gameInstances.active.byPlayer.count", Meteor.userId());
  });
});

Template.nav.helpers({
  "instanceCount": function () {
    // Return the number of active game instances by the user
    return Counts.get('gameInstances.active.byPlayer.count');
  }
});

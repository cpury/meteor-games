Meteor.startup(function () {
  sAlert.config({
    effect: 'slide',
    position: 'bottom-right',
    timeout: 5000,
    html: false,
    onRouteClose: true,
    stack: true
  });
});

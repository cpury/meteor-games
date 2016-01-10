// Hides and shows the loading modal reactively based on a session variable

Session.setDefault("loadingState", false);

Template.loadingModal.onRendered(function () {
  $('#loadingModal').modal({
    closable: false
  });
});

Tracker.autorun(function() {
  if (Session.get('loadingState')) {
    $('#loadingModal').modal('show');
  } else {
    $('#loadingModal').modal('hide');
  }
});

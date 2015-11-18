// Determines some global methods to show and hide modal dialogs

showLoadingModal = function() {
  $('#loadingModal').modal({
    closable: false
  });
  $('#loadingModal').modal('show');
};

hideLoadingModal = function() {
  $('#loadingModal').modal('hide');
};

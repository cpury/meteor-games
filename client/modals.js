showLoadingModal = function() {
  $('#loadingModal').modal({
    closable: false
  });
  $('#loadingModal').modal('show');
};

hideLoadingModal = function() {
  $('#loadingModal').modal('hide');
};
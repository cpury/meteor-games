var playerChars = ['X', 'O'];

Template.connectFour.onCreated(function () {
  var self = this;

  self.autorun(function () {
    showLoadingModal();

    self.subscribe("gameInstances", function () {
      var currentGameInstanceId = FlowRouter.getParam("instanceId");
      var currentGameInstance = GameInstances.findOne(currentGameInstanceId);

      if (!currentGameInstance) {
        FlowRouter.go('/');
      }

      Session.set('gameInstance', currentGameInstance);

      if (currentGameInstance.players.indexOf(Meteor.userId()) === -1) {
        Meteor.call("joinGameInstance", currentGameInstanceId, function (err, data) {
          if (data === false) {
            return;
          }
          Session.set('gameReady', true);
          hideLoadingModal();
          if (err) {
            console.log("Error while joining game:", err);
            return;
          }
          if (currentGameInstance.nPlayers + 1 < currentGameInstance.minPlayers) {
            showInviteMessage();
          }
        });
      } else {
        hideLoadingModal();
        if (currentGameInstance.nPlayers < currentGameInstance.minPlayers) {
          showInviteMessage();
        }
      }

      GameInstances.find(currentGameInstanceId).observeChanges({
        changed: function (id, fields) {
          var currentGameInstanceId = FlowRouter.getParam("instanceId");
          var currentGameInstance = GameInstances.findOne(currentGameInstanceId);
          Session.set('gameInstance', currentGameInstance);

          if (fields.status != null || fields.currentTurnPlayerN != null) {
            $('#statusString').transition('jiggle');
          }
        }
      });
    });
  });
});

Template.connectFour.onRendered(function () {
  if (!Session.get('gameReady')) {
    $('#gameOverviewSegment').addClass('loading');
  }
});

Template.connectFour.helpers({
  currentGameInstance: function () {
    return Session.get('gameInstance');
  },

  gameStatusString: function () {
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }

    playerN = gameInstance.players.indexOf(Meteor.userId());

    if (gameInstance.status === 'waitingForPlayers') {
      return 'Waiting for players'

    } else if (gameInstance.status === 'playing') {
      if (gameInstance.currentTurnPlayerN === playerN) {
        return 'Your Turn!'
      } else {
        return 'Player ' + parseInt(gameInstance.currentTurnPlayerN + 1) + '\'s Turn'
      }

    } else if(gameInstance.status === 'finished') {
      if (gameInstance.winner === null) {
        return 'It\'s a tie!';
      }

      if (gameInstance.winner === playerN) {
        return 'You Won!'
      } else {
        return 'Player ' + parseInt(gameInstance.winner + 1) + ' Won!'
      }
    }
  },

  isMyTurn: function () {
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return false;
    }

    playerN = gameInstance.players.indexOf(Meteor.userId());

    return (gameInstance.currentTurnPlayerN === playerN);
  },
});

Template.cfBoard.helpers({
  rows: function() {
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return null;
    }

    return gameInstance.state.grid;
  },
});

Template.cfColumn.helpers({
  cellPlayer: function(row, col) {
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }

    return gameInstance.state.grid[row][col];
  },

  cell: function(row, col) {
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }
    val = gameInstance.state.grid[row][col];

    if (val === -1) {
      return '';
    }
    return playerChars[val];
  },
});

var runAI = function() {
  Meteor.call("doMove", FlowRouter.getParam("instanceId"), "ai", function (err, data) {
    if (err) {
      console.log("Error doing AI move:", err);
      return;
    }
  });
}

Template.connectFour.events({
  "click .cf.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var currentGameInstanceId = FlowRouter.getParam("instanceId")
    var currentGameInstance = Session.get('gameInstance');

    if (!currentGameInstance || currentGameInstance.status != 'playing') {
      return;
    }

    if (currentGameInstance.state.grid[row][col] != -1) {
      return;
    }

    var move = {
      col: col,
    };

    Meteor.call("doMove", FlowRouter.getParam("instanceId"), move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }

      // Check if it's AI's turn
      if (!data) {
        var currentGameInstance = Session.get('gameInstance');
        if (currentGameInstance.players.indexOf('ai') != -1) {
          setTimeout(
            runAI,
            1000);
        }
      }
    });
  },
});

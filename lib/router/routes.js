// Defines the routes for FlowRouter

var resetGameSession = function () {
  // Helper to remove game instance-related session variables.
  // Call before changing route.
  Session.set('gameInstance', null);
  Session.set('gameReady', false);
};

FlowRouter.route('/', {
  name: "home",
  action: function(params, queryParams) {
    resetGameSession();

    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "home",
      nav: "nav",
    });
  }
});

FlowRouter.route('/games/tick-tack-toe/:instanceId', {
  name: "tickTackToe",
  action: function(params, queryParams) {
    resetGameSession();

    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "tickTackToe",
      nav: "nav",
      instanceId: params.instanceId,
    });
  }
});

FlowRouter.route('/games/connect-four/:instanceId', {
  name: "connectFour",
  action: function(params, queryParams) {
    resetGameSession();

    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "connectFour",
      nav: "nav",
      instanceId: params.instanceId,
    });
  }
});

FlowRouter.notFound = {
  action: function() {
    resetGameSession();

    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "pageNotFound",
      nav: "nav",
    });
  }
};

// Routes for the useraccounts:flow-routing package
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

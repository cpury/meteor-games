// Defines the routes for FlowRouter

FlowRouter.route('/', {
  name: "home",
  action: function(params, queryParams) {
    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "home",
      nav: "nav",
    });
  }
});

FlowRouter.route('/active-games/', {
  name: "activeGames",
  action: function(params, queryParams) {
    BlazeLayout.render('masterLayout', {
      footer: "footer",
      main: "activeGames",
      nav: "nav",
    });
  }
});

FlowRouter.route('/games/tick-tack-toe/:instanceId', {
  name: "tickTackToe",
  action: function(params, queryParams) {
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

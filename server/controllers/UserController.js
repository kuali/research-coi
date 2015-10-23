export let init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/userinfo', function(req, res) {
    res.send({
      firstName: req.userInfo.firstName,
      lastName: req.userInfo.lastName,
      coiRole: req.userInfo.coiRole
    });
  });
};

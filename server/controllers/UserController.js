export let init = app => {
  /**
    @Role: any
  */
  app.get('/api/coi/username', function(req, res) {
    res.send(req.userInfo.displayName);
  });
};

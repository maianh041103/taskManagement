const taskRoute = require('./task.route');
const userRoute = require('./user.route');
const authMiddlerware = require('../middlerwares/auth.middlerware');

module.exports = (app) => {
  const version = '/api/v1';
  app.use(version + "/tasks", authMiddlerware.auth, taskRoute);
  app.use(version + '/users', userRoute);
}

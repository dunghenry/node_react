const user = require('./user.route');
const routes = (app) => {
    app.use('/user', user);
};

module.exports = routes;

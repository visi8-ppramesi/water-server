// const serveStatic = require('serve-static');
// const path = require('path');
const query = require('../app/middlewares/query');
const hashCheck = require('../app/middlewares/checkHash')

const getRoute = module => require(`../app/routes/${module}`);

module.exports = (app) => {
  // PUBLIC FILES

  // app.use('/', serveStatic(path.join(__dirname, '../apidoc')));

  // MIDDLEWARES

  app.use(query);
  // app.post(hashCheck);

  // ROUTES

  app.use('/v1/api/flowdata', getRoute('flowdata'));
  app.use('/v1/api/location', getRoute('location'))
  app.use('/v1/api/aggregate', getRoute('aggregate'));
  app.use('/v1/api/user', getRoute('user'))


  // ERROR HANDLERS

  // catch 404 and forward to error handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // error handler
  app.use((err, req, res) => {
    const message = err.message;
    const error = app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).json({ message, error });
  });
};

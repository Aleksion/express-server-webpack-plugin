var express = require('express');
var middleware = require('swagger-express-middleware');
var _ = require('lodash');
var util = require('util');

var app = express();

module.exports = {
  initialize: function(options){
    this.options = options;
  },
  run: function(options){
    var self = this;

    var defaultOptions = {
      filePath: 'swagger.yaml',
      port: 9000,
      metadata: true,
      cors: true,
      files: true,
      parseRequest: true,
      validateRequest: true,
      mock: true
    };

    self.options = _.extend({}, defaultOptions, options);

    middleware(self.options.filePath, app, function(err, middleware) {
        if(err){
          console.log(process.cwd());
          console.log(err);
          return;
        }



        app.use('/ui', express.static(__dirname + '/dist'));
        // Add all the Swagger Express Middleware, or just the ones you need.
        // NOTE: Some of these accept optional options (omitted here for brevity)
        /**
         * Use metadata middleware
         */
        if(self.options.metadata){app.use(middleware.metadata())}
        /**
         * Use CORS middleware
         */
        if(self.options.cors){app.use(middleware.CORS())}
        /**
         * Use files middleware
         */
        if(self.options.files){app.use(middleware.files())}
        /**
         * Use parseRequest middleware
         */
        if(self.options.parseRequest){app.use(middleware.parseRequest())}
        /**
         * Use validateRequest middleware
         */
        if(self.options.validateRequest){app.use(middleware.validateRequest())}
        /**
         * Use mock middleware
         */
        if(self.options.mock){app.use(middleware.mock())}


        app.use(function(err, req, res, next) {
          console.log("Current Path is: ");
          console.log(process.cwd());
          console.log("Designated File Path is: ");
          console.log(self.options.filePath);
          res.status(err.status);
          res.type('html');
          res.send(util.format('<html><body><h1>%d Error!</h1><p>%s</p></body></html>', err.status, err.message));
        });


        app.listen(self.options.port, function() {
            console.log('The Sample api is now running at http://localhost:'+self.options.port);
        });


    });
  }
}

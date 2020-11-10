const helmet = requie('helmet');
const compression = require('compression');

module.exports = function (app) {
	app.use(helmet());
	app.use(compression());
};

require('app-module-path').addPath(__dirname);
const debug = require('debug')('statistics-plugin');
const mongoose = require('mongoose');
const statisticService = require('./lib/statistic.service');
const statisticRouter = require('./lib/statistic.router');

function init() {

}

function middleware(app, plugin, generalConfig) {
    const connection = mongoose.createConnection(`${generalConfig.mongoUri}`);
    debug('Loading statistics-plugin');
    app.use(statisticService(connection).middleware);
    app.use(statisticRouter(connection).middleware());
}


module.exports = {
    middleware,
    init,
};

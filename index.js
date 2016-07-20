const debug = require('debug')('stadistics-plugin');
const StadisticRouter = require('./lib/stadistic.router');
const StadisticService = require('./lib/stadistic.service');

const mongoose = require('mongoose');

function init() {

}

function middleware(app, plugin, generalConfig) {
    mongoose.connect(`${generalConfig.mongoUri}/stadistics`);
    debug('Loading stadistics-plugin');
    app.use(StadisticService.middleware);
    app.use(StadisticRouter.middleware());
}


module.exports = {
    middleware,
    init,
};

const debug = require('debug')('stadistics-plugin');
const Router = require('koa-router');
const StadisticModel = require('./stadistic.model');
const ApiRouter = new Router({
    prefix: '/api/v1/stadistic',
});

class StadisticRouter {

    static async get(ctx) {
        debug('Obtaining stadistics');
        ctx.body = await StadisticModel.find().sort('-date').exec();
    }

    static async timeByRequest(ctx) {
        debug('Obtaining stadistics aggrouped');
        let filter = null;
        debug('start', ctx.query.from);
        if (ctx.query.from || ctx.query.to) {
            filter = {
                $match: {
                    date: {},
                },
            };
            if (ctx.query.from) {
                filter.$match.date.$gte = new Date(new Date(ctx.query.from).getTime() - (new Date(ctx.query.from).getTimezoneOffset() * 60000));
            }
            if (ctx.query.to) {
                filter.$match.date.$lte = new Date(new Date(ctx.query.to).getTime() - (new Date(ctx.query.to).getTimezoneOffset() * 60000) + (24 * 60 * 60 * 1000) - 60000);
            }
        }
        const query = [];
        if (filter) {
            query.push(filter);
        }
        query.push({
            $group: {
                _id: {
                    endpointPath: '$endpointPath',
                    sourceMethod: '$sourceMethod',
                },
                sum: { $sum: '$time' },

            },
        });
        ctx.body = await StadisticModel.aggregate(query).exec();
    }

    static async avgByRequest(ctx) {
        debug('Obtaining stadistics aggrouped');
        let filter = null;
        debug('start', ctx.query.from);
        if (ctx.query.from || ctx.query.to) {
            filter = {
                $match: {
                    date: {},
                },
            };
            if (ctx.query.from) {
                filter.$match.date.$gte = new Date(new Date(ctx.query.from).getTime() - (new Date(ctx.query.from).getTimezoneOffset() * 60000));
            }
            if (ctx.query.to) {
                filter.$match.date.$lte = new Date(new Date(ctx.query.to).getTime() - (new Date(ctx.query.to).getTimezoneOffset() * 60000) + (24 * 60 * 60 * 1000) - 60000);
            }
        }
        const query = [];
        if (filter) {
            query.push(filter);
        }
        query.push({
            $group: {
                _id: {
                    endpointPath: '$endpointPath',
                    sourceMethod: '$sourceMethod',
                },
                sum: { $avg: '$time' },

            },
        });
        ctx.body = await StadisticModel.aggregate(query).exec();
    }

    static async requestByDay(ctx) {
        debug('Obtaining stadistics aggrouped');
        let filter = null;
        debug('start', ctx.query.from);
        if (ctx.query.from || ctx.query.to) {
            filter = {
                $match: {
                    date: {},
                },
            };
            if (ctx.query.from) {
                filter.$match.date.$gte = new Date(new Date(ctx.query.from).getTime() - (new Date(ctx.query.from).getTimezoneOffset() * 60000));
            }
            if (ctx.query.to) {
                filter.$match.date.$lte = new Date(new Date(ctx.query.to).getTime() - (new Date(ctx.query.to).getTimezoneOffset() * 60000) + (24 * 60 * 60 * 1000) - 60000);
            }
        }
        const query = [];
        if (filter) {
            query.push(filter);
        }
        query.push({
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' },
                },
                count: { $sum: 1 },
            },
        });
        ctx.body = await StadisticModel.aggregate(query).exec();
    }

}

ApiRouter.get('/requestByDay', StadisticRouter.requestByDay);
ApiRouter.get('/timeByRequest', StadisticRouter.timeByRequest);
ApiRouter.get('/avgByRequest', StadisticRouter.avgByRequest);
ApiRouter.get('/', StadisticRouter.get);

module.exports = ApiRouter;

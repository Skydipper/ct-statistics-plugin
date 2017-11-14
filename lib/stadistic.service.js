const debug = require('debug')('stadistics-plugin');
const stadisticFunction = require('./stadistic.model');
const geoip = require('geoip-lite');

function getService(connection) {

    const StadisticModel = stadisticFunction(connection);

    class StadisticService {

        static async completeGeoInfo() {
            debug('Loading stadistics to complete geo info');
            const stadistics = await StadisticModel.find({
                ip: {
                    $exists: true,
                },
                'geo.completed': false,
            }).limit(10000).exec();
            debug('Ips found ', stadistics.length);
            for (let i = 0, length = stadistics.length; i < length; i++) {
                if (stadistics[i].ip && stadistics[i].ip.indexOf('127.0.0.1') === -1) {
                    let ip = stadistics[i].ip;
                    if (ip.indexOf(',') >= 0) {
                        ip = ip.split(',')[1];
                    }
                    const geo = geoip.lookup(ip);
                    if (geo) {
                        stadistics[i].geo = {
                            city: geo.city,
                            country: geo.country,
                            region: geo.region,
                            ll: geo.ll,
                            completed: true,
                        };
                    } else {
                        stadistics[i].geo = {
                            completed: true,
                        };
                    }
                } else {
                    stadistics[i].geo = {
                        completed: true,
                    };
                }
                await stadistics[i].save();
            }
            debug('Finish complete geo');
        }

        static async middleware(ctx, next) {
            const first = Date.now();
            let error = false;
            let errorCode = null;
            try {
                await next();
            } catch (e) {
                error = true;
                errorCode = e.status || 500;
                throw e;
            } finally {
                if (ctx.state.source && ctx.state.source.path) {
                    const model = {
                        sourcePath: ctx.state.source.path,
                        sourceMethod: ctx.state.source.method,
                        error,
                        errorCode,
                        cached: false,
                        time: Date.now() - first,
                        ip: ctx.headers['x-forwarded-for'],
                        anonymous: (!ctx.state.user && !ctx.req.user),
                        loggedUser: ctx.state.user || ctx.req.user,
                    };
                    if (ctx.state.redirect) {
                        model.endpointPath = ctx.state.redirect.endpoint.path;
                        model.redirectUrl = ctx.state.redirect.url;
                        model.redirectMethod = ctx.state.redirect.method;
                    }

                    debug('Saving stadistic');
                    await new StadisticModel(model).save();
                } else {
                    const model = {
                        sourcePath: ctx.path,
                        sourceMethod: ctx.request.method,
                        error,
                        errorCode,
                        cached: ctx.state.isCached || false,
                        time: Date.now() - first,
                        ip: ctx.headers['x-forwarded-for'],
                        anonymous: (!ctx.state.user && !ctx.req.user),
                    };


                    debug('Saving stadistic');
                    await new StadisticModel(model).save();

                }
            }
        }

    }
    return StadisticService;
}
module.exports = getService;

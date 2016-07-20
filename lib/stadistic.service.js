const debug = require('debug')('stadistics-plugin');
const StadisticModel = require('./stadistic.model');


class StadisticService {

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
                    time: Date.now() - first,
                    ip: ctx.request.ip,
                    anonymous: (!ctx.state.user && !ctx.req.user),
                };
                if (ctx.state.redirect) {
                    model.endpointPath = ctx.state.redirect.endpoint.path;
                    model.redirectUrl = ctx.state.redirect.url;
                    model.redirectMethod = ctx.state.redirect.method;
                }

                debug('Saving stadistic');
                await new StadisticModel(model).save();
            }
        }
    }

}
module.exports = StadisticService;

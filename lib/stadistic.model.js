const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bluebird = require('bluebird');

mongoose.Promise = bluebird;


const Stadistic = new Schema({
    sourcePath: { type: String, required: true, trim: true },
    sourceMethod: { type: String, required: true, trim: true },
    redirectUrl: { type: String, required: false, trim: true },
    redirectMethod: { type: String, required: false, trim: true },
    endpointPath: { type: String, required: false, trim: true },
    time: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    error: { type: Boolean, required: true, default: false },
    errorCode: { type: Number, required: false },
    ip: { type: String, required: false, trim: true },
    anonymous: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model('Stadistic', Stadistic);

#!/usr/bin/env node
'use strict';

var optimist = require('optimist')
    .usage('Usage: $0 -H [hostname] -p [port] --help')
    .default('H', 'localhost')
    .default('p', 6379)
    .describe('H', 'hostname of the redis server')
    .describe('p', 'port of the redis server')
    .describe('help', 'prints this help message');
var argv = optimist.argv;
var redis = require('redis');

if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}

var client = redis.createClient(argv.p, argv.H);

client.on("error", function (err) {
    console.log('CRITICAL - ', err.toString());
    process.exit(3);
});

client.on('ready', function() {
    console.log('OK -', 'uptime_in_days:', client.server_info.uptime_in_days);
    client.end();
    process.exit(0);
});
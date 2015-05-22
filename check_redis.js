#!/usr/bin/env node
'use strict';

var optimist = require('optimist')
    .usage('Usage: $0 -H [hostname] -p [port] -t [check_type] -w -c --help')
    .default('H', 'localhost')
    .default('p', 6379)
	.default('t', 'ping')
	.default('w', '1GB')
	.default('c', '2GB')
    .describe('H', 'hostname of the redis server')
    .describe('p', 'port of the redis server')
	.describe('t', 'type to check, ping or memory')
	.describe('w', 'warning threshold (e.g. 100MB or 1GB, only used when type is memory)')
	.describe('c', 'critical threshold (e.g. 100MB or 1GB, only used when type is memory)')
    .describe('help', 'prints this help message');
var argv = optimist.argv;
var redis = require('redis');
var bytes = require('bytes');

var exitCode = 0;

if (argv.help) {
    optimist.showHelp();
    process.exit(exitCode);
}

var client = redis.createClient(argv.p, argv.H);

client.on("error", function (err) {
    console.log('CRITICAL - ', err.toString());
	exitCode = 2;
});

client.on('ready', function() {
	if (argv.t === 'ping')
		console.log('OK -', 'uptime_in_days:', client.server_info.uptime_in_days);
	if (argv.t === 'memory') {
		var usage = parseInt(client.server_info.used_memory);
		var message = bytes(usage) + ' of memory used.';

		if (usage >= bytes(argv.c)) {
			console.log('CRITICAL -', message);
			exitCode = 2;
		} else if (usage >= bytes(argv.w)) {
			console.log('WARNING -', message);
			exitCode = 1;
		} else
			console.log('OK -', message);
	}

	client.end();
	process.exit(exitCode);
});
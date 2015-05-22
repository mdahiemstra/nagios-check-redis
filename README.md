## nagios-check-redis

Simple plugin for nagios to check status of a redis server.

## Requirements

- NodeJS
- Nagios

## Installing

To download the latest version:

    npm install -g nagios-redis

## Usage

	nagios-redis -H localhost -p 6379

Edit your commands.cfg and add the following:

	define command {
	    command_name    check_redis
	    command_line    $USER1$/nagios-redis/check_redis.js -H $HOSTADDRESS$ -p $ARG1$
	}

Now you can monitor redis servers by adding:

	define service {
	    use                 	generic-service
	    hostgroup_name          Redis servers
	    service_description     Redis server check
	    check_command           check_redis!6379
	}

## Usage monitoring remote host with NRPE

Add the command to your NRPE configuration on your remote host:

	command[check_redis]=check_redis

Monitor the service on your Nagios host:

	define service{
	        use                             generic-service
	        host_name                       your host
	        service_description             Redis status
	        check_command                   check_nrpe!check_redis
	}

## License

nope

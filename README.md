## nagios-check-redis

Simple plugin for nagios to check status or memory usage of a redis server.

## Prerequisites

- NodeJS
- Nagios
- NRPE (optional)

## Installing

To download the latest version:

    npm install -g nagios-redis

## Usage

	# check ping
	check_redis -H localhost -p 6379 -t ping
	
	# check memory
	check_redis -H localhost -p 6379 -t memory -w 1GB -c 2GB
	
	check_redis --help
	
Note on units: when memory size is needed, it is possible to specify it in the usual form of 1k 5GB 4M and so forth.

Edit your commands.cfg and add the following:

	define command {
	    command_name    check_redis_ping
	    command_line    $USER1$/nagios-redis/check_redis.js -H $HOSTADDRESS$ -p $ARG1$ -t ping
	}

	define command {
	    command_name    check_redis_memory
	    command_line    $USER1$/nagios-redis/check_redis.js -H $HOSTADDRESS$ -p $ARG1$ -t memory -w $ARG2$ -c $ARG3$
	}

Now you can monitor redis servers by adding:

	define service {
	    use                 	generic-service
	    hostgroup_name          Redis servers
	    service_description     Redis ping
	    check_command           check_redis_ping!6379
	}

	define service {
	    use                 	generic-service
	    hostgroup_name          Redis servers
	    service_description     Redis memory
	    check_command           check_redis_memory!6379!1GB!2GB
	}

## Usage monitoring remote host with NRPE

Add the command to your NRPE configuration on your remote host:

	command[check_redis_ping]=check_redis -t ping
    command[check_redis_memory]=check_redis -t memory -w 2GB -c 3GB

Monitor the service on your Nagios host:

	define service{
			use                             generic-service
			host_name                       your host
			service_description             Redis ping
			check_command                   check_nrpe!check_redis_ping
			servicegroups					redis
	}
	
	define service{
			use                             generic-service
			host_name                       your host
			service_description             Redis memory
			check_command                   check_nrpe!check_redis_memory
			servicegroups					redis
	}
	
P.S. We could provide the arguments from Nagios to the NRPE configuration (with nrpe dont_blame_nrpe set to true) but this is quicker and easier to manage.

## License

nope :)

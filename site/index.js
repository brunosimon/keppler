// Dependencies
var express   = require( 'express' ),
	helmet    = require( 'helmet' ),
	http      = require( 'http' ),
	socket_io = require( 'socket.io' ),
	colors    = require( 'colors' ),
	path      = require( 'path' ),
	ip        = require( 'ip' );

// Express
var express = express();

express.use( '/codes', require( './controllers/index.js' ) )

// Server
var server = http.createServer( express ),
	server_port = 3000;

// Server
server.listen( server_port, function()
{
    // URL
    var url = 'http://' + ip.address() + ':' + server_port;

    console.log( colors.green( '---------------------------' ) );
    console.log( 'server'.green.bold + ' - ' + 'started'.cyan );
    console.log( 'server'.green.bold + ' - ' + url.cyan );
} );

// Socket
var io = socket_io.listen( server );

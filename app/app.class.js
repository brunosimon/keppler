'use strict'

// Depedencies
let chokidar         = require( 'chokidar' ),
	path             = require( 'path' ),
	colors           = require( 'colors' ),
	ip               = require( 'ip' ),
	socket_io_client = require( 'socket.io-client' )

/**
 * App class
 */
class App
{
	/**
	 * Constructor
	 */
	constructor( _options )
	{
		this.set_options( _options )
		this.set_args()
		this.set_watcher()
		this.set_socket()
	}

	/**
	 * Set options
	 */
	set_options( _options )
	{
		// No option
		if( typeof _options !== 'object' )
			_options = {}

		// Defaults
		if( typeof _options.domain === 'undefined' )
			_options.domain = ip.address()

		if( typeof _options.port === 'undefined' )
			_options.port = 3000

		// Save
		this.options = _options
	}

	/**
	 * Set args
	 * Test missing arg
	 */
	set_args()
	{
		// Set up
		this.arguments = process.argv.slice( 2 )

		// Missing project slug
		if( this.arguments.length === 0 )
		{
			// Stop process
			console.log( 'Missing arguments: first argument should be the projet slug'.red )
			process.exit()
		}

		// Wrong project slug
		if( !this.arguments[ 0 ].match( /^[a-z_-][a-z0-9_-]+$/ ) )
		{
			// Stop process
			console.log( 'Wrong arguments: projet slug'.red )
			process.exit()
		}
	}

	/**
	 * Set socket
	 * Connect to site
	 */
	set_socket()
	{
		// Set up
		this.socket = socket_io_client( `http://${this.options.domain}:${this.options.port}` )

		// Connect event
		this.socket.on( 'connect', () =>
		{
			console.log( 'connected' )
			this.socket.emit( 'start_project', { slug : this.arguments[ 0 ] } )
		} )
	}

	/**
	 * Set watcher
	 * Listen to modifications on file and folders
	 */
	set_watcher()
	{
		// Set up
		this.watcher = chokidar.watch(
				process.cwd(),
				{
					ignored : /[\/\\]\./,
					ignoreInitial : true
				}
			)

		// Add event
		this.watcher.on( 'add', ( _path ) =>
		{
			console.log( 'add:'.green.bold, _path )
		} )

		// Change event
		this.watcher.on( 'change', ( _path ) =>
		{
			console.log( 'change:'.green.bold, _path )
		} )

		// Unlink event
		this.watcher.on( 'unlink', ( _path ) =>
		{
			console.log( 'unlink:'.green.bold, _path )
		} )

		// AddDir event
		this.watcher.on( 'addDir', ( _path ) =>
		{
			console.log( 'addDir:'.green.bold, _path )
		} )

		// UnlinkDir event
		this.watcher.on( 'unlinkDir', ( _path ) =>
		{
			console.log( 'unlinkDir:'.green.bold, _path )
		} )
	}
}

module.exports = App

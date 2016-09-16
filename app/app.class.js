'use strict'

// Depedencies
let chokidar         = require( 'chokidar' ),
	path             = require( 'path' ),
	colors           = require( 'colors' ),
	ip               = require( 'ip' ),
	socket_io_client = require( 'socket.io-client' ),
	fs               = require( 'fs' )

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
			_options.port = 1571

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

		// Missing project name
		if( this.arguments.length === 0 )
		{
			// Stop process
			console.log( 'Missing arguments: first argument should be the projet name'.red )
			process.exit()
		}

		// // Wrong project name
		// if( !this.arguments[ 0 ].match( /^[a-z_-][a-z0-9_-]+$/ ) )
		// {
		// 	// Stop process
		// 	console.log( 'Wrong arguments: projet name'.red )
		// 	process.exit()
		// }
	}

	/**
	 * Set socket
	 * Connect to site
	 */
	set_socket()
	{
		// Set up
		this.socket = socket_io_client( `http://${this.options.domain}:${this.options.port}/app` )

		// Connect event
		this.socket.on( 'connect', () =>
		{
			console.log( 'connected'.green )
			this.socket.emit( 'start_project', { name: this.arguments[ 0 ] } )
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
					ignored      : /[\/\\]\./,
					ignoreInitial: true
				}
			)

		// Add event
		this.watcher.on( 'add', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			console.log( 'add:'.green.bold, relative_path )

			// Read
			fs.readFile( _path, ( error, data ) =>
			{
				// Send
				this.socket.emit( 'create_file', { path: relative_path, content: data.toString() } )
			} )
		} )

		// Change event
		this.watcher.on( 'change', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			console.log( 'change:'.green.bold, relative_path )

			// Read
			fs.readFile( _path, ( error, data ) =>
			{
				// Send
				this.socket.emit( 'update_file', { path: relative_path, content: data.toString() } )
			} )
		} )

		// Unlink event
		this.watcher.on( 'unlink', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			console.log( 'unlink:'.green.bold, relative_path )

			// Send
			this.socket.emit( 'delete_file', { path: relative_path } )
		} )

		// AddDir event
		this.watcher.on( 'addDir', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			console.log( 'addDir:'.green.bold, relative_path )

			// Send
			this.socket.emit( 'create_folder', { path: relative_path } )
		} )

		// UnlinkDir event
		this.watcher.on( 'unlinkDir', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			console.log( 'unlinkDir:'.green.bold, relative_path )

			// Send
			this.socket.emit( 'delete_folder', { path: relative_path } )
		} )
	}
}

module.exports = App

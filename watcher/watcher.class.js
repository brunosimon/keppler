'use strict'

// Depedencies
let chokidar         = require( 'chokidar' ),
	path             = require( 'path' ),
	colors           = require( 'colors' ),
	ip               = require( 'ip' ),
	socket_io_client = require( 'socket.io-client' ),
	fs               = require( 'fs' ),
	mime             = require( 'mime' )

/**
 * Watcher class
 */
class Watcher
{
	/**
	 * Constructor
	 */
	constructor( _options )
	{
		this.set_options( _options )
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
		if( typeof _options.debug === 'undefined' )
			_options.debug = false

		if( typeof _options.port === 'undefined' )
			_options.port = 1571

		if( typeof _options.domain === 'undefined' )
			_options.domain = `http://${ip.address()}:${_options.port}`

		// Save
		this.options = _options
	}

	/**
	 * Set socket
	 * Connect to site
	 */
	set_socket()
	{
		// Set up
		this.socket = socket_io_client( `${this.options.domain}/app` )

		// Connect event
		this.socket.on( 'connect', () =>
		{
			this.socket.emit( 'start_project', { name: this.options.name } )

			// Debug
			if( this.options.debug )
			{
				console.log( 'connected'.green.bold )
			}
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
			let relative_path = _path.replace( process.cwd(), '.' ),
				mime_type     = mime.lookup( relative_path ),
				file          = {}

			file.path     = relative_path;
			file.can_read = true;

			// Test mime type
			if( mime_type.match(/^(audio)|(video)|(image)/) )
			{
				file.can_read = false;
			}

			// Retrieve stats
			fs.stat( _path, ( error, stats ) =>
			{
				if( stats.size > 999999 )
					file.can_read = false

				// Read
				fs.readFile( _path, ( error, data ) =>
				{
					if( file.can_read )
						file.content = data.toString()

					// Send
					this.socket.emit( 'create_file', file )
				} )
			} )

			// Debug
			if( this.options.debug )
			{
				console.log( 'add:'.green.bold, relative_path )
			}
		} )

		// Change event
		this.watcher.on( 'change', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' ),
				mime_type     = mime.lookup( relative_path ),
				file          = {}

			file.path     = relative_path;
			file.can_read = true;

			// Test mime type
			if( mime_type.match(/^(audio)|(video)|(image)/) )
			{
				file.can_read = false;
			}

			// Retrieve stats
			fs.stat( _path, ( error, stats ) =>
			{
				if( stats.size > 999999 )
					file.can_read = false

				// Read
				fs.readFile( _path, ( error, data ) =>
				{
					if( file.can_read )
						file.content = data.toString()

					// Send
					this.socket.emit( 'update_file', file )
				} )
			} )

			// Debug
			if( this.options.debug )
			{
				console.log( 'change:'.green.bold, relative_path )
			}
		} )

		// Unlink event
		this.watcher.on( 'unlink', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			// Send
			this.socket.emit( 'delete_file', { path: relative_path } )

			// Debug
			if( this.options.debug )
			{
				console.log( 'unlink:'.green.bold, relative_path )
			}
		} )

		// AddDir event
		this.watcher.on( 'addDir', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			// Send
			this.socket.emit( 'create_folder', { path: relative_path } )

			// Debug
			if( this.options.debug )
			{
				console.log( 'addDir:'.green.bold, relative_path )
			}
		} )

		// UnlinkDir event
		this.watcher.on( 'unlinkDir', ( _path ) =>
		{
			// Set up
			let relative_path = _path.replace( process.cwd(), '.' )

			// Send
			this.socket.emit( 'delete_folder', { path: relative_path } )

			// Debug
			if( this.options.debug )
			{
				console.log( 'unlinkDir:'.green.bold, relative_path )
			}
		} )
	}
}

module.exports = Watcher

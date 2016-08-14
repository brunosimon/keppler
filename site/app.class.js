'use strict'

// Dependencies
let express   = require( 'express' ),
	helmet    = require( 'helmet' ),
	http      = require( 'http' ),
	socket_io = require( 'socket.io' ),
	colors    = require( 'colors' ),
	ip        = require( 'ip' ),
	util      = require( 'util' ),
	path      = require( 'path' ),
	Projects  = require( './models/projects.class.js' ),
	fs        = require( 'fs' )

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

		this.domain = 'http://' + ip.address() + ':' + this.options.port

		this.set_express()
		this.set_server()
		this.set_socket()
		this.set_models()
		this.set_dummy()
	}

	/**
	 * Set Dummy
	 */
	set_dummy()
	{
		// Default project
		let project = this.projects.create_project( 'dummy' )

		// // Same name projects
		// let project_2 = this.projects.create_project( 'dummy' )
		// let project_3 = this.projects.create_project( 'dummy' )
		// let project_4 = this.projects.create_project( 'dummy' )
		// let project_5 = this.projects.create_project( 'dummy' )

		// Some file
		project.files.create_version( './folder-1/test-4.css', fs.readFileSync( '../test-folder/folder-1/test-4.css', 'utf8' ) )
		project.files.create_version( './folder-2/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3.js', 'utf8' ) )
		project.files.create_version( './test-1.html', fs.readFileSync( '../test-folder/test-1.html', 'utf8' ) )
		project.files.create_version( './test-2.php', fs.readFileSync( '../test-folder/test-2.php', 'utf8' ) )
		project.files.create_version( './big-one.txt', 'content 4\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline' )

		// project.files.create_version( './toto/tata/lorem.txt', '123456789' )
		// project.files.create_version( './toto/tata/lorem.txt', '1aze' )
		// project.files.create_version( './toto/tata/ipsum.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia asperiores iure, animi voluptatibus ut officiis. Molestias, quod perferendis hic totam doloremque, porro aperiam enim tenetur, maxime inventore consequuntur nisi in?' )

		// Adding file versions
		let counting = 0
		setInterval( function()
		{
			project.files.create_version( './multi-version.txt', 'test: ' + counting++ )
		}, 2000 )

		// Creating and deleting file
		let toggle = true
		setInterval( function()
		{
			if( toggle )
				project.files.create( './toggle.txt', 'content' )
			else
				project.files.delete( './toggle.txt', 'content' )

			toggle = !toggle

		}, 3000 )

		// Log
		console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
	}

	/**
	 * Set models
	 */
	set_models()
	{
		// Set up
		this.projects = new Projects( { socket: this.sockets.main } )
	}

	/**
	 * Set options
	 */
	set_options( _options )
	{
		// No option
		if( typeof _options !== 'object' )
			_options = {}

		if( typeof _options.port === 'undefined' )
			_options.port = 3000

		// Save
		this.options = _options
	}

	/**
	 * Set express
	 * Start express and set controllers
	 */
	set_express()
	{
		// Set up
		this.express = express()
		this.express.use( helmet() )
		this.express.set( 'view engine', 'jade' )
		this.express.set( 'views', path.join( __dirname, 'views' ) )
		this.express.use( express.static( path.join( __dirname, 'public' ) ) )

		this.express.locals.domain = this.domain

		// Controllers
		this.express.use( '/', require( './controllers/index.js' ) )
	}

	/**
	 * Set server
	 */
	set_server()
	{
		// Set up
		this.server = http.createServer( this.express )

		// Start
		this.server.listen( this.options.port, () =>
		{
			// URL
			console.log( colors.green( '---------------------------' ) )
			console.log( 'server'.green.bold + ' - ' + 'started'.cyan )
			console.log( 'server'.green.bold + ' - ' + this.domain.cyan )
		} )
	}

	/**
	 * Set socket
	 */
	set_socket()
	{
		// Set up
		this.sockets      = {}
		this.sockets.main = socket_io.listen( this.server )
		this.sockets.app  = this.sockets.main.of( '/app' )

		// App connection event
		this.sockets.app.on( 'connection', ( socket ) =>
		{
			// Set up
			let project = null

			console.log( 'socket app'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

			// Start project
			socket.on( 'start_project', ( data ) =>
			{
				project = this.projects.create_project( data.name )

				console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
			} )

			// Update file
			socket.on( 'update_file', ( data ) =>
			{
				project.files.create_version( data.path, data.content )

				console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
			} )

			// Create file
			socket.on( 'create_file', ( data ) =>
			{
				project.files.create( data.path, data.content )

				console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
			} )

			// Delete file
			socket.on( 'delete_file', ( data ) =>
			{
				project.files.delete( data.path )

				console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
			} )

			// Disconnect
			socket.on( 'disconnect', () =>
			{
				console.log( 'socket app'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan )

				this.projects.delete_project( project.slug )
			} );
		} )
	}
}

module.exports = App

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
	Projects  = require( './models/projects.class.js' )

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
		this.set_models()
		this.set_express()
		this.set_server()
		this.set_socket()
	}

	/**
	 * Set models
	 */
	set_models()
	{
		// Set up
		this.projects = new Projects()

		// Tests
		var project = this.projects.create_project( 'dummy' )
		project.create_folder( './toto' )
		project.get_folder( './toto//tutu/tete', true )
		project.create_file( './coucou/coco.txt', 'content 0' )
		project.create_file( './test-1.txt', 'content 1' )
		project.update_file( './toto/tata/lorem.txt', 'content 2' )
		project.update_file( './toto/tata/ipsum.txt', 'content 3' )
		project.delete_folder( './toto/tutu', true )
		project.delete_file( './toto/tata/ipsum.txt' )
		// console.log( util.inspect( project, { depth: null, colors: true } ) )
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
		    let url = 'http://' + ip.address() + ':' + this.options.port

		    console.log( colors.green( '---------------------------' ) )
		    console.log( 'server'.green.bold + ' - ' + 'started'.cyan )
		    console.log( 'server'.green.bold + ' - ' + url.cyan )
		} )
	}

	/**
	 * Set socket
	 */
	set_socket()
	{
		// Set up
		this.sockets          = {}
		this.sockets.main     = socket_io.listen( this.server )
		this.sockets.app      = this.sockets.main.of( '/app' )
		this.sockets.projects = this.sockets.main.of( '/projects' )

		// Projects connection event
		this.sockets.projects.on( 'connection', ( socket ) =>
		{
		    console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		    socket.emit( 'update_projects', this.projects.describe() )
		} );

		// App connection event
		this.sockets.app.on( 'connection', ( socket ) =>
		{
			// Set up
			let project = null

		    console.log( 'socket app'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		    // Start project
		    socket.on( 'start_project', ( data ) =>
		    {
		    	// Create project
				project = this.projects.create_project( data.slug )

				// Create socket with specific namespace
				project.socket = this.sockets.main.of( '/project/' + project.name )

				// Emit to projects socket
		    	this.sockets.projects.emit( 'update_projects', this.projects.describe() )

		    	console.log( util.inspect( project.folders, { depth: null, colors: true } ) )
		    } )

		    socket.on( 'update_file', ( data ) =>
		    {
		    	project.update_file( data.path, data.content )
		    	project.socket.emit( 'update_project', project )

		    	console.log( util.inspect( project, { depth: null, colors: true } ) )
		    } )

		    socket.on( 'create_file', ( data ) =>
		    {
	    		project.create_file( data.path, data.content )
	    		project.socket.emit( 'update_project', project )

	    		console.log( util.inspect( project, { depth: null, colors: true } ) )
		    } )

		    socket.on( 'delete_file', ( data ) =>
		    {
	    		project.delete_file( data.path )
	    		project.socket.emit( 'update_project', project )

	    		console.log( util.inspect( project, { depth: null, colors: true } ) )
		    } )

		    socket.on( 'create_folder', ( data ) =>
		    {
		    	project.create_folder( data.path, data.content )
		    	project.socket.emit( 'update_project', project )

		    	console.log( util.inspect( project, { depth: null, colors: true } ) )
		    } )

		    socket.on( 'delete_folder', ( data ) =>
		    {
		    	project.delete_folder( data.path )
		    	project.socket.emit( 'update_project', project )

		    	console.log( util.inspect( project, { depth: null, colors: true } ) )
		    } )
		} )

		// this.sockets.projects.on( 'connection', ( socket ) =>
		// {
		// 	console.log( 'socket site'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		// 	socket.emit( 'update_project', project )
		// } )
	}
}

module.exports = App

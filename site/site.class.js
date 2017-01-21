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
	fs        = require( 'fs' ),
	opener    = require( 'opener' )

/**
 * Site class
 */
class Site
{
	/**
	 * Constructor
	 */
	constructor( _options )
	{
		this.set_options( _options )
		this.set_express()
		this.set_server()
		this.set_socket()
		this.set_models()
		this.set_dummy()
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
	 * Set Dummy
	 */
	set_dummy()
	{
		if( !this.options.debug )
			return

		// Default project
		let project = this.projects.create_project( 'Dummy project' )

		// // Same name projects
		// let project_2 = this.projects.create_project( 'dummy' )
		// let project_3 = this.projects.create_project( 'dummy' )
		// let project_4 = this.projects.create_project( 'dummy' )
		// let project_5 = this.projects.create_project( 'dummy' )

		// Some file
		project.files.create_version( './folder-test/test-4.css', fs.readFileSync( '../test-folder/folder-1/test-4.css', 'utf8' ) )
		project.files.create_version( './folder-test/depth-test/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3.js', 'utf8' ) )
		project.files.create_version( './folder-test/depth-test/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3-diff-1.js', 'utf8' ) )
		project.files.create_version( './folder-test/depth-test/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3-diff-2.js', 'utf8' ) )
		project.files.create_version( './folder-test/depth-test/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3-diff-3.js', 'utf8' ) )
		project.files.create_version( './folder-test/depth-test/test-3.js', fs.readFileSync( '../test-folder/folder-2/test-3-diff-4.js', 'utf8' ) )
		project.files.create_version( './folder-test/test-1.html', fs.readFileSync( '../test-folder/test-1.html', 'utf8' ) )
		project.files.create_version( './folder-test/test-2.php', fs.readFileSync( '../test-folder/test-2.php', 'utf8' ) )
		project.files.create_version( './folder-test/big-one.txt', 'line\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline' )
		project.files.create_version( './folder-test/loooooooooooooooooooooooooooooooong-one.txt', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz' )

		project.files.create_version( './icons/test.js', 'Test icon' )
		project.files.create_version( './icons/test.html', 'Test icon' )
		project.files.create_version( './icons/test.sass', 'Test icon' )
		project.files.create_version( './icons/test.scss', 'Test icon' )
		project.files.create_version( './icons/test.less', 'Test icon' )
		project.files.create_version( './icons/test.stylus', 'Test icon' )
		project.files.create_version( './icons/test.styl', 'Test icon' )
		project.files.create_version( './icons/test.css', 'Test icon' )
		project.files.create_version( './icons/test.php', 'Test icon' )
		project.files.create_version( './icons/test.json', 'Test icon' )
		project.files.create_version( './icons/test.jade', 'Test icon' )
		project.files.create_version( './icons/test.pug', 'Test icon' )
		project.files.create_version( './icons/test.md', 'Test icon' )
		project.files.create_version( './icons/test.sql', 'Test icon' )
		project.files.create_version( './icons/test.htaccess', 'Test icon' )
		project.files.create_version( './icons/test.htpasswd', 'Test icon' )
		project.files.create_version( './icons/test.yml', 'Test icon' )
		project.files.create_version( './icons/test.svg', 'Test icon' )
		project.files.create_version( './icons/test.eot', 'Test icon' )
		project.files.create_version( './icons/test.ttf', 'Test icon' )
		project.files.create_version( './icons/test.woff', 'Test icon' )
		project.files.create_version( './icons/test.woff2', 'Test icon' )
		project.files.create_version( './icons/test.jpeg', 'Test icon' )
		project.files.create_version( './icons/test.jpg', 'Test icon' )
		project.files.create_version( './icons/test.tiff', 'Test icon' )
		project.files.create_version( './icons/test.gif', 'Test icon' )
		project.files.create_version( './icons/test.bmp', 'Test icon' )
		project.files.create_version( './icons/test.png', 'Test icon' )
		project.files.create_version( './icons/test.webp', 'Test icon' )
		project.files.create_version( './icons/test.mpeg', 'Test icon' )
		project.files.create_version( './icons/test.mpg', 'Test icon' )
		project.files.create_version( './icons/test.mp4', 'Test icon' )
		project.files.create_version( './icons/test.amv', 'Test icon' )
		project.files.create_version( './icons/test.wmv', 'Test icon' )
		project.files.create_version( './icons/test.mov', 'Test icon' )
		project.files.create_version( './icons/test.avi', 'Test icon' )
		project.files.create_version( './icons/test.ogv', 'Test icon' )
		project.files.create_version( './icons/test.mkv', 'Test icon' )
		project.files.create_version( './icons/test.webm', 'Test icon' )
		project.files.create_version( './icons/test.mp3', 'Test icon' )
		project.files.create_version( './icons/test.wav', 'Test icon' )
		project.files.create_version( './icons/test.ogg', 'Test icon' )
		project.files.create_version( './icons/test.raw', 'Test icon' )
		project.files.create_version( './icons/test.zip', 'Test icon' )
		project.files.create_version( './icons/test.rar', 'Test icon' )
		project.files.create_version( './icons/test.7z', 'Test icon' )
		project.files.create_version( './icons/test.gz', 'Test icon' )
		project.files.create_version( './icons/test.txt', 'Test icon' )
		project.files.create_version( './icons/test.coffee', 'Test icon' )
		project.files.create_version( './icons/test.gitignore', 'Test icon' )
		project.files.create_version( './icons/test.gitkeep', 'Test icon' )
		project.files.create_version( './icons/test.xml', 'Test icon' )
		project.files.create_version( './icons/test.twig', 'Test icon' )
		project.files.create_version( './icons/test.c', 'Test icon' )
		project.files.create_version( './icons/test.h', 'Test icon' )
		project.files.create_version( './icons/test.pwet', 'Test icon' )

		// project.files.create_version( './toto/tata/lorem.txt', '123456789' )
		// project.files.create_version( './toto/tata/lorem.txt', '1aze' )
		// project.files.create_version( './toto/tata/ipsum.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia asperiores iure, animi voluptatibus ut officiis. Molestias, quod perferendis hic totam doloremque, porro aperiam enim tenetur, maxime inventore consequuntur nisi in?' )

		// Adding file versions
		let counting = 0
		setInterval( function()
		{
			project.files.create_version( './folder-test/multi-version.txt', 'test: ' + counting++ )
		}, 2000 )

		// Creating and deleting file
		let toggle = true
		setInterval( function()
		{
			if( toggle )
				project.files.create( './folder-test/toggle.txt', 'content' )
			else
				project.files.delete( './folder-test/toggle.txt', 'content' )

			toggle = !toggle

		}, 3000 )

		// // Log
		// console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
	}

	/**
	 * Set models
	 */
	set_models()
	{
		// Set up
		this.projects = new Projects( { socket: this.sockets.main, debug: this.options.debug } )
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
		this.express.set( 'view engine', 'pug' )
		this.express.set( 'views', path.join( __dirname, 'views' ) )
		this.express.use( express.static( path.join( __dirname, 'public' ) ) )

		let config = require( '../package.json' )

		this.express.locals.keppler_version = config.version
		this.express.locals.domain          = this.options.domain

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

		// Error event
		this.server.on( 'error', ( error ) =>
		{
			// Server already running
			if( error.code === 'EADDRINUSE' )
			{
				// Debug
				if( this.options.debug )
				{
					console.log( 'server already running'.green.bold )
				}

				return
			}

			console.log( error.message )
		} )

		// Start
		this.server.listen( this.options.port, () =>
		{
			// URL
			console.log( colors.green( '---------------------------' ) )
			console.log( 'server'.green.bold + ' - ' + 'started'.cyan )
			console.log( 'server'.green.bold + ' - ' + this.options.domain.cyan )
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

			// Debug
			if( this.options.debug )
			{
				console.log( 'socket app'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )
			}

			// Start project
			socket.on( 'start_project', ( data ) =>
			{
				project = this.projects.create_project( data.name )

				let url = this.options.domain + '/project/' + project.slug

				console.log( 'server'.green.bold + ' - ' + url .cyan )

				// Open in browser
				opener( url )

				// Debug
				if( this.options.debug )
				{
					console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
				}
			} )

			// Update file
			socket.on( 'update_file', ( data ) =>
			{
				project.files.create_version( data.path, data.content )

				// Debug
				if( this.options.debug )
				{
					console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
				}
			} )

			// Create file
			socket.on( 'create_file', ( data ) =>
			{
				project.files.create( data.path, data.content )

				// Debug
				if( this.options.debug )
				{
					console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
				}
			} )

			// Delete file
			socket.on( 'delete_file', ( data ) =>
			{
				project.files.delete( data.path )

				// Debug
				if( this.options.debug )
				{
					console.log( util.inspect( project.files.describe(), { depth: null, colors: true } ) )
				}
			} )

			// Disconnect
			socket.on( 'disconnect', () =>
			{
				this.projects.delete_project( project.slug )

				// Debug
				if( this.options.debug )
				{
					console.log( 'socket app'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan )
				}
			} )
		} )
	}
}

module.exports = Site

'use strict'

// Dependencies
let slug   = require( 'slug' ),
	Files  = require( './files.class.js' )

class Project
{
	constructor( options )
	{
		this.name  = options.name
		this.slug  = slug( this.name )
		this.files = new Files()

		this.set_socket( options.socket )
	}

	set_socket( socket )
	{
		// Set up
		this.original_socket = socket
		this.socket          = this.original_socket.of( '/project/' + this.slug )

		// Connection event
		this.socket.on( 'connection', ( socket ) =>
		{
		    console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		    console.log(this.describe());
		    this.socket.emit( 'update_project', this.describe() )
		} )
	}

	describe()
	{
		// Set up
		let result = {}
		result.name  = this.name
		result.files = this.files.describe()

		return result
	}
}

module.exports = Project

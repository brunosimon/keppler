'use strict'

// Dependencies
let slug   = require( 'slug' ),
	Files  = require( './files.class.js' )

class Project
{
	constructor( options )
	{
		this.set_name( options.name )
		this.set_socket( options.socket )

		this.files = new Files( { socket: this.socket } )
	}

	set_name( _name )
	{
		this.name = _name
		this.slug = slug( this.name )
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

	destructor()
	{
		this.socket.emit( 'destruct' )
	}
}

module.exports = Project

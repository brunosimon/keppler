'use strict'

// Dependencies
let slug   = require( 'slug' ),
	Files  = require( './files.class.js' )

class Project
{
	constructor( _options )
	{
		this.set_options( _options )
		this.set_name( _options.name )
		this.set_socket( _options.socket )

		this.files = new Files( { socket: this.socket } )
		this.date  = new Date()
	}

	/**
	 * Set options
	 */
	set_options( _options )
	{
		if( typeof _options.debug === 'undefined' )
		{
			_options.debug = false
		}

		// Save
		this.options = _options
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
		    this.socket.emit( 'update_project', this.describe() )

		    if( this.options.debug )
		    {
		    	console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )
		    }
		} )
	}

	describe()
	{
		// Set up
		let result = {}
		result.name  = this.name
		result.files = this.files.describe()
		result.date  = this.date

		return result
	}

	destructor()
	{
		this.socket.emit( 'destruct' )
	}
}

module.exports = Project

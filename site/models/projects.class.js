'use strict'

let Project = require( './project.class.js' )

class Projects
{
	constructor( options )
	{
		this.all = {}

		this.set_socket( options.socket )
	}

	set_socket( socket )
	{
		// Set up
		this.original_socket = socket
		this.socket          = this.original_socket.of( '/projects' )

		// Connection event
		this.socket.on( 'connection', ( socket ) =>
		{
		    console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		    this.socket.emit( 'update_projects', this.describe() )
		} );
	}

	create_project( _name )
	{
		// Create project
		let project = new Project( { name: _name, socket: this.original_socket } )

		// Save
		this.all[ project.slug ] = project

		// Emit
    	this.socket.emit( 'update_projects', this.describe() )

		// Return
		return project
	}

	get_project_by_slug( _slug )
	{
		// Find project
		let project = this.all[ _slug ]

		// Found
		if( project )
			return project

		// Not found
		return false
	}

	describe()
	{
		let result = {}
		result.all = {}

		for( let _slug in this.all )
		{
			let _project = this.all[ _slug ]

			result.all[ _slug ] = {
				slug: _project.slug,
				name: _project.name
			}
		}

		return result
	}
}

module.exports = Projects

'use strict'

let Project = require( './project.class.js' )

class Projects
{
	constructor( _options )
	{
		this.all = {}

		this.set_options( _options )
		this.set_socket( _options.socket )
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

	set_socket( socket )
	{
		// Set up
		this.original_socket = socket
		this.socket          = this.original_socket.of( '/projects' )

		// Connection event
		this.socket.on( 'connection', ( socket ) =>
		{
		    this.socket.emit( 'update_projects', this.describe() )

		    if( this.options.debug )
		    {
		    	console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )
		    }
		} )
	}

	create_project( _name )
	{
		// Create project
		let project           = new Project( { name: _name, socket: this.original_socket, debug: this.options.debug } ),
			same_name_project = this.all[ project.slug ]

		// Try to found same name project
		while( typeof same_name_project !== 'undefined' )
		{
			// Found new number
			let last_number = same_name_project.name.match(/\d+$/),
				new_number  = 2

			if( last_number && last_number.length )
			{
				last_number = ~~last_number[ 0 ]

				new_number = last_number + 1
			}

			// Update project name
			project.set_name( _name + ' ' + new_number )

			// Try to found
			same_name_project = this.all[ project.slug ]
		}

		// Save
		this.all[ project.slug ] = project

		// Emit
    	this.socket.emit( 'update_projects', this.describe() )

		// Return
		return project
	}

	delete_project( _slug )
	{
		// Set up
		let project = this.all[ _slug ]

		// Project found
		if( typeof project !== 'undefined' )
		{
			// Delete
			delete this.all[ _slug ]
			project.destructor()

			// Emit
	    	this.socket.emit( 'update_projects', this.describe() )
		}
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
				slug            : _project.slug,
				name            : _project.name,
				files_count     : _project.files.count,
				date            : _project.date,
				last_update_date: _project.files.last_version_date,
			}
		}

		return result
	}
}

module.exports = Projects

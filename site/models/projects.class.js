'use strict'

let Project = require( './project.class.js' )

class Projects
{
	constructor()
	{
		this.all = {}
	}

	create_project( _name )
	{
		// Create project
		let project = new Project( _name )

		// Save
		this.all[ project.name ] = project

		// Return
		return project
	}

	get_project_by_name( _name )
	{
		// Find project
		let project = this.all[ _name ]

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

		for( let _name in this.all )
		{
			let _project = this.all[ _name ]

			result.all[ _name ] = {
				name : _project.name
			}
		}

		return result
	}
}

module.exports = Projects

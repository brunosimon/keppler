'use strict'

let Project = require( './project.class.js' )

class Projects
{
	constructor()
	{
		this.all = {}
	}

	create_project( _slug )
	{
		// Create project
		let project = new Project( _slug )

		// Save
		this.all[ project.slug ] = project

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
}

module.exports = Projects
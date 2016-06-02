'use strict'

// Depedencies
let diff = require( 'diff' )

class File
{
	constructor( _name, _content )
	{
		// Set up
		this.name     = _name
		this.versions = []

		// Create first version
		if( typeof _content !== 'undefined' )
			this.create_version( _content )
	}

	create_version( content )
	{
		// Create version
		let version = {}

		// Set up
		version.date    = new Date()
		version.content = content

		this.versions.push( version )
	}

	destructor()
	{
		console.log( 'destruct' )
	}
}

module.exports = File

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
		let version      = {},
			last_version = this.get_last_version()

		version.date    = new Date()
		version.content = content
		version.diff    = last_version ? diff.diffChars( last_version.content, version.content ) : false

		// Save
		this.versions.push( version )
	}

	get_last_version()
	{
		if( this.versions.length === 0 )
			return false

		return this.versions[ this.versions.length - 1 ]
	}

	destructor()
	{
		console.log( 'destruct' )
	}
}

module.exports = File

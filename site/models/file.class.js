'use strict'

// Depedencies
let diff  = require( 'diff' ),
	paths = require( '../utils/paths.class.js' ),
	ids   = require( '../utils/ids.class.js' )

class File
{
	constructor( _options )
	{
		// Set up
		this.id             = ids.get_id()
		this.name           = _options.name
		this.path           = {}
		this.path.directory = _options.path
		this.path.full      = this.path.directory + '/' + this.name
		this.path.parts     = this.path.full.split( paths.separator )
		this.versions       = []

		// Create first version
		if( typeof _options.content !== 'undefined' )
			this.create_version( _options.content )
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

	describe()
	{
		// Set up
		let result = {}
		result.id       = this.id
		result.name     = this.name
		result.path     = this.path
		result.versions = this.versions

		return result
	}

	destructor()
	{

	}
}

module.exports = File

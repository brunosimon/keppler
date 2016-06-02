'use strict'

// Dependencies
let path = require( 'path' ),
	util = require( 'util' ),
	File = require( './file.class.js' )

class Project
{
	constructor( name )
	{
		this.name    = name
		this.folders = {
			root:
			{
				name   : 'root',
				files  : {},
				folders: {}
			}
		}
	}

	create_file( _path, _content )
	{
		// Set up
		let normalize_path = path.normalize( _path ),
			parsed_path    = path.parse( normalize_path )

		// Retrieve file
		let file = this.get_file( normalize_path )

		// File already exist
		if( file )
			return false

		// Retrieve folder (force creation)
		let folder = this.get_folder( parsed_path.dir, true )

		// Create
		file = new File( parsed_path.base )
		folder.files[ file.name ] = file

		// Has content
		if( _content )
			file.create_version( _content )

		return file
	}

	get_file( _path, _force_creation )
	{
		// Params
		if( typeof _force_creation === 'undefined' )
			_force_creation = false

		// Set up
		let normalize_path = path.normalize( _path ),
			parsed_path    = path.parse( normalize_path )

		// Retrieve folder
		let folder = this.get_folder( parsed_path.dir, _force_creation )

		// Folder not found
		if( !folder )
			return false

		// Retrieve file
		let file = folder.files[ parsed_path.base ]

		// File found
		if( file )
			return file

		// Force creation
		if( _force_creation )
		{
			// Create folders
			file = this.create_file( normalize_path )

			return file
		}

		// Not found
		return false
	}

	update_file( _path, _content )
	{
		// Set up
		let normalize_path = path.normalize( _path )

		// Retrieve file
		let file = this.get_file( normalize_path, true )

		// Create version
		file.create_version( _content )
	}

	delete_file( _path )
	{
		// Set up
		let normalize_path = path.normalize( _path ),
			parsed_path    = path.parse( normalize_path )

		// Retrieve folder
		let folder = this.get_folder( parsed_path.dir )

		// Folder found
		if( folder )
		{
			let file = folder.files[ parsed_path.base ]

			// File found
			if( file )
			{
				file.destructor()
				delete folder.files[ parsed_path.base ]
			}
		}
	}

	create_folder( _path )
	{
		// Set up
		let normalize_path = path.normalize( _path ),
			path_parts     = normalize_path.split( path.sep ),
			folder         = this.folders.root

		for( let _path_part of path_parts )
		{
			// Temporary folder
			let __folder = folder.folders[ _path_part ]

			// Folder doesn't exist
			if( typeof __folder === 'undefined' )
			{
				__folder         = {}
				__folder.name    = _path_part
				__folder.files   = {}
				__folder.folders = {}

				folder.folders[ _path_part ] = __folder
			}

			folder = __folder
		}

		return folder
	}

	get_folder( _path, _force_creation )
	{
		// Params
		if( typeof _force_creation === 'undefined' )
			_force_creation = false

		let normalize_path = path.normalize( _path ),
			path_parts     = normalize_path.split( path.sep ),
			folder         = this.folders.root,
			found          = true

		for( let _path_part of path_parts )
		{
			folder = folder.folders[ _path_part ]

			// Folder not found
			if(typeof folder === 'undefined')
			{
				found = false
				break
			}
		}

		// Folder found
		if( found )
			return folder

		// Force creation
		if( _force_creation )
		{
			// Create folders
			folder = this.create_folder( normalize_path )

			return folder
		}

		// Not found
		return false
	}

	delete_folder( _path )
	{
		// Set up
		let normalize_path = path.normalize( _path ),
			path_parts     = _path.split( path.sep ),
			folder         = this.get_folder( normalize_path )

		// Folder not found
		if( !folder )
			return false

		// Recursive callback
		let delete_folder = function( folder )
			{
				for( let _folder_name in folder.folders )
				{
					delete_folder( folder.folders[ _folder_name ] )
				}

				for( let _file_name in folder.files  )
				{
					let file = folder.files[ _file_name ]

					file.destructor()
					delete folder.files[ _file_name ]
				}
			}

		delete_folder( folder )

		return true
	}
}

module.exports = Project

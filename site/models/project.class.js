'use strict'

// Dependencies
let path = require( 'path' ),
	util = require( 'util' ),
	File = require( './file.class.js' )

class Project
{
	constructor()
	{
		this.folders = {
			root:
			{
				name   : 'root',
				files  : {},
				folders: {}
			}
		}
	}

	update_file( _path, _content )
	{
		// Set up
		let normalize_path = path.normalize( _path ),
			parsed_path    = path.parse( normalize_path )

		// Retrieve folder
		let folder = this.get_folder( parsed_path.dir )

		// Folder doesn't exist
		if( !folder )
		{
			// Create folders
			folder = this.create_folder( parsed_path.dir )
		}

		// Retrieve file
		let file = folder.files[ parsed_path.base ]

		// File doesn't exist
		if( !file )
		{
			file = new File( parsed_path.base )
			folder.files[ file.name ] = file
		}

		file.create_version( _content )
	}

	get_folder( _path )
	{
		let path_parts = _path.split( path.sep ),
			folder     = this.folders.root

		for( let _path_part of path_parts )
		{
			folder = folder.folders[ _path_part ]

			// Folder not found
			if(typeof folder === 'undefined')
				return false
		}

		return folder
	}

	create_folder( _path )
	{
		// Set up
		let path_parts = _path.split( path.sep ),
			folder     = this.folders.root

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

		return folder;
	}

	// clean_folders()
	// {
	// 	// Empty all
	// 	this.folders.all = {}

	// 	let clean_folder = function( folder )
	// 		{
	// 			for( let _folder_name in folder.folders )
	// 			{
	// 				clean_folder( folder.folders[ _folder_name ] )
	// 			}
	// 		}

	// 	clean_folder( this.folders.root )
	// }

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
				delete folder.files[ parsed_path.base ]
			}
		}
	}
}

module.exports = Project
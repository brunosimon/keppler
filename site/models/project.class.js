'use strict'

// Dependencies
let paths = require( '../utils/paths.class.js' ),
	util  = require( 'util' ),
	slug  = require( 'slug' ),
	File  = require( './file.class.js' )

class Project
{
	constructor( options )
	{
		this.name    = options.name
		this.slug    = slug( this.name )
		this.folders = {
			'.':
			{
				name   : '.',
				files  : {},
				folders: {}
			}
		}

		this.set_socket( options.socket )
	}

	set_socket( socket )
	{
		// Set up
		this.original_socket = socket
		this.socket          = this.original_socket.of( '/project/' + this.slug )

		// Connection event
		this.socket.on( 'connection', ( socket ) =>
		{
		    console.log( 'socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan )

		    this.socket.emit( 'update_project', this.describe() )
		} );
	}

	create_file( _path, _content )
	{
		// Set up
		let normalized_path = paths.normalize( _path ),
			parsed_path     = paths.parse( normalized_path )

		// Retrieve file
		let file = this.get_file( normalized_path )

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

		// Emit
		this.socket.emit( 'update_project', this.describe() )

		return file
	}

	get_file( _path, _force_creation )
	{
		// Params
		if( typeof _force_creation === 'undefined' )
			_force_creation = false

		// Set up
		let normalized_path = paths.normalize( _path ),
			parsed_path     = paths.parse( normalized_path )

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
			file = this.create_file( normalized_path )

			return file
		}

		// Not found
		return false
	}

	update_file( _path, _content )
	{
		// Set up
		let normalized_path = paths.normalize( _path )

		// Retrieve file
		let file = this.get_file( normalized_path, true )

		// Create version
		file.create_version( _content )

		// Emit
    	this.socket.emit( 'update_project', this.describe() )
	}

	delete_file( _path )
	{
		// Set up
		let parsed_path = paths.parse( _path )

		// Retrieve folder
		let folder = this.get_folder( parsed_path.dir )

		// Folder found
		if( folder )
		{
			let file = folder.files[ parsed_path.base ]

			// File found
			if( file )
			{
				// Delete file
				file.destructor()
				delete folder.files[ parsed_path.base ]

				// Emit
				this.socket.emit( 'update_project', this.describe() )
			}
		}
	}

	create_folder( _path )
	{
		// Set up
		let normalized_path = paths.normalize( _path ),
			path_folders    = normalized_path.split( paths.separator ),
			folder          = this

		for( let _path_folder of path_folders )
		{
			// Temporary folder
			let _folder = folder.folders[ _path_folder ]

			// Folder doesn't exist
			if( typeof _folder === 'undefined' )
			{
				_folder         = {}
				_folder.name    = _path_folder
				_folder.files   = {}
				_folder.folders = {}

				folder.folders[ _path_folder ] = _folder
			}

			folder = _folder
		}

		// Emit
		this.socket.emit( 'update_project', this.describe() )

		return folder
	}

	get_folder( _path, _force_creation )
	{
		// Params
		if( typeof _force_creation === 'undefined' )
			_force_creation = false

		let normalized_path = paths.normalize( _path ),
			path_folders    = normalized_path.split( paths.separator ),
			folder          = this,
			found           = true

		for( let _path_folder of path_folders )
		{
			folder = folder.folders[ _path_folder ]

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
			folder = this.create_folder( normalized_path )

			return folder
		}

		// Not found
		return false
	}

	delete_folder( _path )
	{
		// Set up
		let normalized_path = paths.normalize( _path ),
			folder          = this.get_folder( normalized_path )

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

		// Emit
		this.socket.emit( 'update_project', this.describe() )

		return true
	}

	describe()
	{
		let result = {}
		result.name = this.name
		result.folders = this.folders

		return result
	}
}

module.exports = Project

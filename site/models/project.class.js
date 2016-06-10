'use strict'

// Dependencies
let paths = require( '../utils/paths.class.js' ),
	ids   = require( '../utils/ids.class.js' ),
	util  = require( 'util' ),
	slug  = require( 'slug' ),
	File  = require( './file.class.js' )

class Project
{
	constructor( options )
	{
		this.name    = options.name
		this.slug    = slug( this.name )
		this.files   = {}
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

		    console.log(this.describe());
		    this.socket.emit( 'update_project', this.describe() )
		} )
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
		file = new File( {
			name   : parsed_path.base,
			path   : parsed_path.dir,
			content: _content
		} )

		// Save
		folder.files[ file.name ] = file.id
		this.files[ file.id ]     = file

		// Emit
		this.socket.emit( 'update_file', file.describe() )
		this.socket.emit( 'update_folders', this.describe_folders() )

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
		let file_id = folder.files[ parsed_path.base ]

		// File found
		if( file_id )
		{
			let file = this.files[ file_id ]
			return file
		}

		// Force creation
		if( _force_creation )
		{
			// Create folders
			let file = this.create_file( normalized_path )

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
    	this.socket.emit( 'update_file', file.describe() )

    	return file
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
			let file_id = folder.files[ parsed_path.base ]

			// File found
			if( file_id )
			{
				let file = this.files[ file_id ]

				// Delete file
				file.destructor()
				delete folder.files[ file.name ]
				delete this.files[ file.id ]

				// Emit
				this.socket.emit( 'delete_file', file_id )
				this.socket.emit( 'update_folders', this.describe_folders() )
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
		this.socket.emit( 'update_folders', this.describe_folders() )

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
		let empty_folder = ( folder ) =>
			{
				// Each folder
				for( let _folder_name in folder.folders )
				{
					empty_folder( folder.folders[ _folder_name ] )

					// Delete folder
					delete folder.folders[ _folder_name ]
				}

				// Each file
				for( let _file_name in folder.files  )
				{
					// Set up
					let file_id = folder.files[ _file_name ],
						file    = this.files[ file_id ]

					// File found
					if( file )
					{
						// Delete file
						this.delete_file( file.path.full )
					}
				}
			}

		empty_folder( folder )

		// Delete folder
		let parsed_path   = paths.parse( normalized_path ),
			parent_folder = this.get_folder( parsed_path.dir )

		if( parent_folder )
			delete parent_folder.folders[ folder.name ]

		// Emit
		this.socket.emit( 'update_folders', this.describe_folders() )

		return true
	}

	describe()
	{
		// Set up
		let result = {}
		result.name    = this.name
		result.folders = this.describe_folders()
		result.files   = this.describe_files()

		return result
	}

	describe_files()
	{
		// Set up
		let result = {}

		// Each file
		for( let _file_id in this.files )
		{
			let _file = this.files[ _file_id ]

			result[ _file_id ] = _file.describe()
		}

		return result
	}

	describe_folders()
	{
		return this.folders
	}
}

module.exports = Project

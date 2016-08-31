'use strict'

/**
 * File/Folder tree
 */
function FileTree( _options )
{
    this._constructor( _options )
}

/**
 * Create tree and add ./ folder
 * @param {Object} _options
 * @param {Boolean} _options.auto_wash - Should clean empty folder on removes
 */
FileTree.prototype._constructor = function( _options = {} )
{
    if( typeof _options !== 'object' )
    {
        console.warn( 'constructor: _options should be an object' )
        return false
    }

    // Options
    this.auto_wash = typeof _options.auto_wash === 'undefined' ? false : _options.auto_wash

    // Set up
    this.folders = {}

    // Initial folder
    this.add_folder( '.', {} )
};

/**
 * Clean path
 * @param {String} _path - Path to clean
 * @return {String} Cleaned path
 */
FileTree.prototype.clean_path = function( _path )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'clean_path: _path should be a string' )
        return false
    }

    // Trim
    _path = _path.trim()

    // Repeating `/`
    _path = _path.replace( /\/+/g, '/' )

    // Ending `/`
    _path = _path.replace( /\/$/, '' )

    // Starting `/`
    _path = _path.replace( /^\//, '' )

    // Missing starting `./`
    if( _path !== '.' && _path.search( './' ) !== 0 )
        _path = './' + _path

    return _path
};

/**
 * Add a folder
 * Can create nested folder in one path
 * @param {String} _path - Path to the folder (start with `./`)
 * @param {Object} _data - Properties to add to the folder
 * @returns {Object} Created folder
 */
FileTree.prototype.add_folder = function( _path, _data = {} )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'add_folder: _path should be a string' )
        return false
    }
    if( typeof _data !== 'object' )
    {
        console.warn( 'add_folder: _data should be an object' )
        return false
    }

    // Set up
    var path       = this.clean_path( _path ),
        path_parts = path.split( '/' ),
        folders    = this.folders,
        folder     = null

    // Each path part
    for( var _part of path_parts )
    {
        // Already exist
        if( typeof folders[ _part ] !== 'undefined' )
        {
            folder  = folders[ _part ]
            folders = folder.folders
        }

        // Folder doesn't exist
        else
        {
            // Create folder
            folder = {
                folders: {},
                files  : {},
                name   : _part,
                data   : _data
            }

            // Save
            folders[ _part ] = folder
            folders = folder.folders
        }
    }

    // Return
    return folder
};

/**
 * Add a file
 * Will create folders if needed
 * @param {String} _path - Path to the folder (start with `./`)
 * @param {Object} _data - Properties to add to the file
 * @returns {Object} Created file
 */
FileTree.prototype.add_file = function( _path, _data = {} )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'add_file: _path should be a string' )
        return false
    }
    if( typeof _data !== 'object' )
    {
        console.warn( 'add_file: _data should be an object' )
        return false
    }

    // Set up
    var path       = this.clean_path( _path ),
        path_parts = path.split( '/' ),
        file_part  = path_parts.pop()

    // Create folder
    var folder = this.add_folder( path_parts.join( '/' ) )

    // Create file
    var file = {
        name: file_part,
        data: _data
    }

    // Save
    folder.files[ file_part ] = file

    return file
};

/**
 * Remove folder
 * Will delete contained folders and contained files
 * @param {String} _path - Folder to delete (start with `./`)
 * @returns {Boolean} Folder deleted or not
 */
FileTree.prototype.remove_folder = function( _path )
{
    // Recursive emptying
    function empty_folder( folder )
    {
        // Delete folders
        for( var _folder_key in folder.folders )
        {
            var _folder = folder.folders[ _folder_key ]

            empty_folder( _folder )

            delete folder.folders[ _folder_key ]

            // Callback
            if( typeof _folder.data.on_remove === 'function' )
            {
                _folder.data.on_remove.apply( this, [ _folder ] )
            }
        }

        // Delete files
        for( var _file_key in folder.files )
        {
            var _file = folder.files[ _file_key ]

            delete folder.files[ _file_key ]

            // Callback
            if( typeof _file.data.on_remove === 'function' )
            {
                _file.data.on_remove.apply( this, [ _file ] )
            }
        }
    }

    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'remove_folder: _path should be a string' )
        return false
    }

    // Set up
    var path        = this.clean_path( _path ),
        path_parts  = path.split( '/' ),
        folder_part = path_parts.pop(),
        folders     = this.folders,
        folder      = null

    // Each path part
    for( var _part of path_parts )
    {
        // Found
        if( typeof folders[ _part ] !== 'undefined' )
        {
            folder  = folders[ _part ]
            folders = folder.folders
        }

        // Not found
        else
        {
            folder  = null
            folders = null
            break
        }
    }

    // Found
    if( folders && folders[ folder_part ] )
    {
        var folder = folders[ folder_part ]

        // Delete
        empty_folder( folder )
        delete folders[ folder_part ]

        // Callback
        if( typeof folder.data.on_remove === 'function' )
        {
            folder.data.on_remove.apply( this, [ folder ] )
        }

        // Auto wash
        if( this.auto_wash )
            this.remove_empty_folders()

        return true
    }

    return false
};

/**
 * Remove file
 * Will delete contained folders and contained files
 * @param {String} _path - File to delete (start with `./`)
 * @returns {Boolean} File deleted or not
 */
FileTree.prototype.remove_file = function( _path )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'remove_file: _path should be a string' )
        return false
    }

    // Set up
    var path       = this.clean_path( _path ),
        path_parts = path.split( '/' ),
        file_part  = path_parts.pop(),
        folders    = this.folders,
        folder     = null

    // Each path part
    for( var _part of path_parts )
    {
        // Found
        if( typeof folders[ _part ] !== 'undefined' )
        {
            folder  = folders[ _part ]
            folders = folder.folders
        }

        // Not found
        else
        {
            folder  = null
            folders = null
            break
        }
    }

    // Folder found
    if( folders && folder )
    {
        var file = folder.files[ file_part ]

        if( typeof file !== 'undefined' )
        {
            // Delete
            delete folder.files[ file_part ]

            // Auto wash
            if( this.auto_wash )
                this.remove_empty_folders()

            // Callback
            if( typeof file.data.on_remove === 'function' )
            {
                file.data.on_remove.apply( this, [ file ] )
            }

            return true
        }
    }

    return false
};

/**
 * Get file
 * @param {String} _path - Path to file
 * @returns {Object} File
 */
FileTree.prototype.get_file = function( _path )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'get_file: _path should be a string' )
        return false
    }

    // Set up
    var path       = this.clean_path( _path ),
        path_parts = path.split( '/' ),
        file_part  = path_parts.pop(),
        folders    = this.folders,
        folder     = null

    // Each path part
    for( var _part of path_parts )
    {
        // Found
        if( typeof folders[ _part ] !== 'undefined' )
        {
            folder  = folders[ _part ]
            folders = folder.folders
        }

        // Not found
        else
        {
            folder  = null
            folders = null
            break
        }
    }

    // Folder found
    if( folders && folder )
    {
        var file = folder.files[ file_part ]

        if( typeof file !== 'undefined' )
        {
            return file
        }
    }

    return false
};

/**
 * Get folder
 * @param {String} _path - Path to folder
 * @returns {Object} Folder
 */
FileTree.prototype.get_folder = function( _path )
{
    // Errors
    if( typeof _path !== 'string' )
    {
        console.warn( 'get_folder: _path should be a string' )
        return false
    }

    // Set up
    var path       = this.clean_path( _path ),
        path_parts = path.split( '/' ),
        folders    = this.folders,
        folder     = null

    // Each path part
    for( var _part of path_parts )
    {
        // Already exist
        if( typeof folders[ _part ] !== 'undefined' )
        {
            folder  = folders[ _part ]
            folders = folder.folders
        }

        // Folder doesn't exist
        else
        {
            return false
        }
    }

    // Return
    return folder
};

/**
 * Browse every folders and remove empty ones
 * @return {Number} Number of removed folders
 */
FileTree.prototype.remove_empty_folders = function()
{
    // Set up
    var removed_count = 0

    // Recursive remove
    function can_remove_folder( folder )
    {
        // Each folder inside current folder
        for( var _folder_key in folder.folders )
        {
            // Try to remove folder
            var _folder    = folder.folders[ _folder_key ],
                can_remove = can_remove_folder( _folder )

            // Remove folder
            if( can_remove )
            {
                removed_count++

                // Delete
                delete folder.folders[ _folder_key ]

                // Callback
                if( typeof _folder.data.on_remove === 'function' )
                {
                    _folder.data.on_remove.apply( this, [ _folder ] )
                }
            }
        }

        // Can be removed
        var folder_keys = Object.keys( folder.folders ),
            files_keys  = Object.keys( folder.files )

        if( folder_keys.length === 0 && folder_keys.length === 0 )
        {
            return true
        }
        else
        {
            return false
        }
    }

    // Try from ./
    can_remove_folder( this.folders[ '.' ] )

    return removed_count
};

/**
 * Describe the tree in ASCII (├ ─ │ └)
 * @param {Boolean} _log - Directly log to console
 * @param {Boolean} _colored - Colored tree (only work well in Chrome)
 * @return {String} Tree
 */
FileTree.prototype.describe = function( _log = false, _colored = false )
{
    // Set up
    var string_tree = '',
        depth       = 0,
        styles      = []

    function add_to_string( value, type = null )
    {
        if( _colored )
        {
            string_tree += '%c'

            switch( type )
            {
                case 'structure':
                    styles.push( 'color:#999;' )
                    break

                case 'folder':
                    styles.push( 'color:#999;' )
                    break
                case 'file':
                    styles.push( 'color:#333;font-weight:bold;' )
                    break

                default:
                    styles.push( '' )
                    break
            }
        }

        string_tree += value
    }

    // Recursive describe
    function describe_folder( folder, depth, last = [] )
    {
        // Set up
        var folder_keys = Object.keys( folder.folders ),
            file_keys   = Object.keys( folder.files )

        // Each folders
        for( var i = 0; i < folder_keys.length; i++ )
        {
            // Set up
            var _folder_key = folder_keys[ i ],
                _folder     = folder.folders[ _folder_key ]

            // Add to tree string
            add_to_string( '\n' )

            for( var j = 0; j < depth; j++ )
            {
                if( j === depth - 1 )
                {
                    if( i === folder_keys.length - 1 && file_keys.length === 0 )
                        add_to_string( ' └', 'structure' )
                    else
                        add_to_string( ' ├', 'structure' )
                }
                else
                {
                    if( last[ j ] )
                        add_to_string( '  ', 'structure' )
                    else
                        add_to_string( ' │', 'structure' )
                }
            }

            add_to_string( '─', 'structure' )
            add_to_string( _folder.name, 'folder' )
            add_to_string( '/', 'structure' )

            // Last
            last.push( i === folder_keys.length - 1 && file_keys.length === 0 )

            // Continue
            describe_folder( _folder, depth + 1, last )
        }

        // Each files
        for( var i = 0; i < file_keys.length; i++ )
        {
            // Set up
            var _file_key = file_keys[ i ],
                _file     = folder.files[ _file_key ]

            // Add to tree string
            string_tree += '\n'

            for( var j = 0; j < depth; j++ )
            {
                if( j === depth - 1 )
                {
                    if( i === file_keys.length - 1 )
                        add_to_string( ' └', 'structure' )
                    else
                        add_to_string( ' ├', 'structure' )
                }
                else
                {
                    if( last[ j ] )
                        add_to_string( '  ', 'structure' )
                    else
                        add_to_string( ' │', 'structure' )
                }
            }

            add_to_string( '─', 'structure' )
            add_to_string( _file.name, 'file' )
        }
    }

    // Describe from ./
    add_to_string( '.', 'folder' )
    add_to_string( '/', 'structure' )
    describe_folder( this.folders[ '.' ], depth + 1 )

    // Log
    if( _log )
    {
        console.log.apply(console, [ string_tree ].concat( styles ) )
    }

    return string_tree
};

// /**
//  * Tests
//  */
// var tree = new FileTree( { auto_wash: false } )

// tree.add_folder( './hey/hoy', { active: false, notifs: 0 } )
// tree.add_folder( './hey/hoy/toto', { active: false, notifs: 0 } )
// tree.add_folder( './hey/hoy/tata', { active: false, notifs: 0 } )

// tree.add_file( './test-1.txt', { active: false, notifs: 0 } )
// tree.add_file( './hey/hoy/test-2.txt', { active: false, notifs: 0 } )
// tree.add_file( './hey/hoy/test-3.txt', { active: false, notifs: 0 } )
// tree.add_file( './hey/hoy/tata/test-4.txt', { active: false, notifs: 0 } )
// tree.add_file( './hey/hoy/toto/test-5.txt', { active: false, notifs: 0 } )

// tree.add_file( './hey/hoy/toto/test-6.txt', { active: false, notifs: 0, on_remove: function( file ){ console.log( 'removed file :', file ); } } )
// tree.remove_file( './hey/hoy/toto/test-6.txt' )

// tree.add_folder( './pwet', { on_remove: function( folder ){ console.log( 'removed folder :', folder ); } } )
// tree.add_folder( './pwet/uh', { on_remove: function( folder ){ console.log( 'removed folder :', folder ); } } )
// tree.remove_folder( './pwet' )

// tree.remove_file( './hey/hoy/test-2.txt' )
// tree.remove_folder( './hey' )

// tree.describe( true, true )

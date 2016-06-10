application.factory(
    'project',
    [
        'config',
        '$timeout',
        function( config, $timeout )
        {
            var update_callback = null;

            function update_folders( folder )
            {
                function recursive_folder_report( new_folder, old_folder )
                {
                    if( typeof old_folder !== 'undefined' && typeof old_folder.active !== 'undefined' )
                        new_folder.active = old_folder.active;

                    for( var _folder_key in new_folder.folders )
                    {
                        var _new_folder = new_folder.folders[ _folder_key ],
                            _old_folder = undefined;

                        if( old_folder )
                            _old_folder = old_folder.folders[ _folder_key ];

                        _new_folder = recursive_folder_report( _new_folder, _old_folder );
                    }

                    return new_folder;
                }

                folder = recursive_folder_report( folder, result.data );

                result.data.folders = folder.folders;
            }

            function update_files( files )
            {

            }

            function delete_file( id )
            {
                delete result.data.files[ id ];
            }

            // Result
            var result  = {};
            result.data = null;

            result.each_folder = function( folder, callback )
            {
                // Only callback provided
                if( typeof folder === 'function' )
                {
                    callback = folder;
                    folder   = result.data;
                }

                // Apply callback
                callback.apply( folder, [ folder ] );

                // Each folder
                for(var _folder_key in folder.folders)
                {
                    var _folder = folder.folders[ _folder_key ];

                    result.each_folder( _folder, callback );
                }
            }

            result.each_file = function( folder, callback )
            {
                // Only callback provided
                if( typeof folder === 'function' )
                {
                    callback = folder;
                    folder   = result.data;
                }

                // Each folder
                result.each_folder( folder, function( folder )
                {
                    // Each file
                    for(var _file_key in folder.files)
                    {
                        var _file = folder.files[ _file_key ];

                        callback.apply( _file, [ _file ] );
                    }
                } );
            }

            result.each_version = function( folder, callback )
            {
                // Only callback provided
                if( typeof folder === 'function' )
                {
                    callback = folder;
                    folder   = result.data;
                }

                // Each file
                result.each_file( folder, function( file )
                {
                    // Each version
                    for(var _version_key in file.versions)
                    {
                        var _version = file.versions[ _version_key ];

                        callback.apply( _version, [ _version ] );
                    }
                } );
            }

            // Update callback
            result.on_update = function( callback )
            {
                update_callback = callback;
            };

            // Connect
            result.connect = function( project_name )
            {
                // Connect to socket
                var socket = io( config.domain + '/project/' + project_name );

                // Connect event
                socket.on( 'connect', function()
                {
                    console.log('connected');
                } );

                socket.on( 'update_file', function( data )
                {
                    console.log('update_file');
                    console.log(data);
                } );

                socket.on( 'delete_file', function( data )
                {
                    console.log('delete_file');
                    console.log(data);

                    delete_file( data );
                } );

                socket.on( 'update_folders', function( data )
                {
                    console.log('update_folders');
                    console.log(data);

                    update_folders( { folders: data } );
                } );

                // Update project event
                socket.on( 'update_project', function( data )
                {
                    console.log('update_project');
                    console.log(data);

                    update_folders( data );
                    update_files( data.files );

                    // // Reformat versions
                    // result.each_version( data, function( version )
                    // {
                    //     // Date
                    //     version.moment_date   = moment( version.date );
                    //     version.date_formated = version.moment_date.format( 'LTS' );
                    //     version.time_from_now = version.moment_date.fromNow();

                    //     // Differencies
                    //     var count    = 0,
                    //         modified = 0;

                    //     if( !version.diff )
                    //     {
                    //         version.diff_ratio = 1;
                    //         count    = 1;
                    //         modified = 1;
                    //     }
                    //     else
                    //     {
                    //         for( var _diff_key in version.diff )
                    //         {
                    //             var _diff = version.diff[ _diff_key ];
                    //             count += _diff.count;

                    //             if( _diff.added /*|| _diff.removed*/ )
                    //                 modified += _diff.count;
                    //         }
                    //         version.diff_ratio = modified / count;
                    //     }

                    //     version.diff_percent = Math.round( version.diff_ratio * 100 ) + '%';
                    // } );

                    // // Save in results
                    // result.data = data;

                    // Apply callback
                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );
            };

            result.data = {
                name   : '',
                folders: {},
                files  : {}
            };

            return result;
        }
    ]
);

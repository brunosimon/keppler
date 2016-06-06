angular_module.factory(
    'project',
    [
        '$timeout',
        function( $timeout )
        {
            var update_callback = null;

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
                var socket = io( 'http://192.168.1.4:3000/project/' + project_name );

                // Connect event
                socket.on( 'connect', function()
                {
                    console.log('connected');
                } );

                // Update project event
                socket.on( 'update_project', function( data )
                {
                    // Reformat versions
                    result.each_version( data, function( version )
                    {
                        var count    = 0,
                            modified = 0;

                        if( !version.diff )
                        {
                            version.diff_ratio = 1;
                            count    = 1;
                            modified = 1;
                        }
                        else
                        {
                            for( var _diff_key in version.diff )
                            {
                                var _diff = version.diff[ _diff_key ];
                                count += _diff.count;

                                if( _diff.removed || _diff.added )
                                    modified += _diff.count;
                            }
                            version.diff_ratio = modified / count;
                        }

                        version.diff_percent = Math.round( version.diff_ratio * 100 ) + '%';
                    } );

                    // Save in results
                    result.data = data;

                    // Apply callback
                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );
            };

            result.data = {"name":"","folders":{}};

            return result;
        }
    ]
);

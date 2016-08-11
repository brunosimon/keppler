application.factory(
    'project',
    [
        'config',
        '$timeout',
        function( config, $timeout )
        {
            // Result
            var result   = {};
            result.name  = '';
            result.files = {};
            result.tree  = new Tree( { auto_wash: false } );

            // Callback
            var update_callback = null;

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

                socket.on( 'create_file', function( data )
                {
                    console.log('create_file');
                    console.log(data);

                    var existing_file = result.files[ data.path.full ];

                    // Doesn't exist yet
                    if( typeof existing_file === 'undefined' )
                    {
                        existing_file = Object.assign( {}, data );
                        existing_file.notif = 0;
                        result.files[ data.path.full ] = existing_file;

                        result.tree.add_file( data.path.full, existing_file )
                    }

                    existing_file.notif++;

                    // Apply callback
                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );

                socket.on( 'create_version', function( data )
                {
                    console.log('create_version');
                    console.log(data);

                    var existing_file = result.files[ data.file ];

                    // Doesn't exist yet
                    if( typeof existing_file !== 'undefined' )
                    {
                        existing_file.versions.push( data.version );

                        existing_file.notif++;

                        // Apply callback
                        if( typeof update_callback === 'function' )
                            update_callback.apply( this, [ data ] );
                    }
                } );

                socket.on( 'delete_file', function( data )
                {
                    console.log('delete_file');
                    console.log(data);
                } );

                // Update project event
                socket.on( 'update_project', function( data )
                {
                    // console.log('update_project');
                    // console.log(data);

                    // Duplicate files
                    for( var _file_key in data.files )
                    {
                        var data_file     = data.files[ _file_key ],
                            existing_file = result.files[ _file_key ];

                        // Doesn't exist yet
                        if( typeof existing_file === 'undefined' )
                        {
                            existing_file = Object.assign( {}, data_file );
                            existing_file.notif = 0;
                            result.files[ _file_key ] = existing_file;

                            result.tree.add_file( _file_key, existing_file )
                        }

                        existing_file.notif++;
                    }

                    // Apply callback
                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );

                // Destruct event
                socket.on( 'destruct', function( data )
                {
                    alert( 'destruct' );
                } );
            };

            return result;
        }
    ]
);

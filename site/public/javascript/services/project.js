application.factory(
    'project',
    [
        'config',
        '$timeout',
        function( config, $timeout )
        {
            // Reformat functions
            function reformat_version( _version )
            {
                // Active
                _version.active = false;

                // Date
                _version.moment_date   = moment( _version.date );
                _version.date_formated = _version.moment_date.format( 'LTS' );
                _version.time_from_now = _version.moment_date.fromNow();

                // Differences
                var count    = 0,
                    modified = 0;

                if( !_version.diff )
                {
                    _version.diff_ratio = 1;
                    count    = 1;
                    modified = 1;
                }
                else
                {
                    for( var _diff_key in _version.diff )
                    {
                        var _diff = _version.diff[ _diff_key ];
                        count += _diff.count;
                        if( _diff.added /*|| _diff.removed*/ )
                            modified += _diff.count;
                    }
                    _version.diff_ratio = modified / count;
                }
                _version.diff_percent = Math.round( _version.diff_ratio * 100 ) + '%';

                return _version;
            }

            function reformat_file()
            {

            }

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
                    var file = result.files[ data.path.full ];

                    // Doesn't exist yet
                    if( typeof file === 'undefined' )
                    {
                        file = Object.assign( {}, data );

                        file.notif = 0;
                        file.new   = true;
                        for( var _version of file.versions )
                        {
                            _version = reformat_version( _version );
                        }

                        result.files[ data.path.full ] = file;

                        result.tree.add_file( data.path.full, file )
                    }

                    // Apply callback
                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );

                socket.on( 'create_version', function( data )
                {
                    var file = result.files[ data.file ];

                    // Doesn't exist yet
                    if( typeof file !== 'undefined' )
                    {
                        data.version = reformat_version( data.version );
                        file.versions.push( data.version );
                        file.notif++;

                        // Apply callback
                        if( typeof update_callback === 'function' )
                            update_callback.apply( this, [ data ] );
                    }
                } );

                socket.on( 'delete_file', function( data )
                {
                    var file = result.files[ data.path.full ];

                    // Doesn't exist yet
                    if( typeof file !== 'undefined' )
                    {
                        result.tree.remove_file( file.path.full )

                        delete result.files[ data.path.full ]

                        // Apply callback
                        if( typeof update_callback === 'function' )
                            update_callback.apply( this, [ data ] );
                    }
                } );

                // Update project event
                socket.on( 'update_project', function( data )
                {
                    result.name  = data.name;

                    // Duplicate files
                    for( var _file_key in data.files )
                    {
                        var data_file = data.files[ _file_key ],
                            file      = result.files[ _file_key ];

                        // Doesn't exist yet
                        if( typeof file === 'undefined' )
                        {
                            file = Object.assign( {}, data_file );

                            // Format data
                            file.notif = 0;
                            file.new   = true;
                            for( var _version of file.versions )
                            {
                                _version = reformat_version( _version );
                            }

                            result.files[ _file_key ] = file;

                            result.tree.add_file( _file_key, file )
                        }
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

application.factory(
    'project',
    [
        'config',
        '$timeout',
        function( config, $timeout )
        {
            // Reformat version function
            function reformat_version( _version )
            {
                // Active
                _version.active = false;

                // Date
                _version.moment_date   = moment( _version.date );
                _version.date_formated = _version.moment_date.format( 'LTS' );
                _version.time_from_now = _version.moment_date.fromNow();

                // Project last update date
                if( _version.moment_date.isAfter( result.last_update_moment_date ) )
                {
                    result.last_update_moment_date   = _version.moment_date;
                    result.last_update_date_formated = _version.date_formated;
                    result.last_update_time_from_now = _version.time_from_now;
                }

                // Lines
                _version.lines = [];
                var length = _version.content.split(/\r\n|\r|\n/).length;
                for( var i = 1; i < length + 1; i++ )
                    _version.lines.push( i );

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

            // Reformat file function
            function reformat_file( _file )
            {
                // Notif
                _file.notif = 0;

                // New
                _file.new = true;

                // Each version
                for( var _version of _file.versions )
                {
                    // Reformat version
                    _version = reformat_version( _version );
                }

                // Icon
                var icon           = 'random',
                    possible_icons = {
                        'js'       : [ 'js' ],
                        'html'     : [ 'html', 'htm' ],
                        'sass'     : [ 'sass', 'scss' ],
                        'less'     : [ 'less' ],
                        'stylus'   : [ 'stylus', 'styl' ],
                        'css'      : [ 'css' ],
                        'php'      : [ 'php' ],
                        'json'     : [ 'json' ],
                        'jade'     : [ 'jade' ],
                        'pug'      : [ 'pug' ],
                        'md'       : [ 'md' ],
                        'sql'      : [ 'sql' ],
                        'apache'   : [ 'htaccess', 'htpasswd' ],
                        'yml'      : [ 'yml' ],
                        'svg'      : [ 'svg' ],
                        'font'     : [ 'eot', 'ttf', 'woff', 'woff2' ],
                        'image'    : [ 'jpeg', 'jpg', 'tiff', 'gif', 'bmp', 'png', 'webp' ],
                        'video'    : [ 'mpeg', 'mpg', 'mp4', 'amv', 'wmv', 'mov', 'avi', 'ogv', 'mkv', 'webm' ],
                        'audio'    : [ 'mp3', 'wav', 'ogg', 'raw' ],
                        'zip'      : [ 'zip', 'rar', '7z', 'gz' ],
                        'txt'      : [ 'txt' ],
                        'coffee'   : [ 'coffee' ],
                        'git'      : [ 'gitignore', 'gitkeep' ],
                        'xml'      : [ 'xml' ],
                        'twig'     : [ 'twig' ],
                        'c'        : [ 'c', 'h' ],
                    };

                for( var _possible_icon_key in possible_icons )
                {
                    var _possible_icon_values = possible_icons[ _possible_icon_key ];
                    if( _possible_icon_values.indexOf( _file.extension ) !== -1 )
                    {
                        icon = _possible_icon_key;
                    }
                }
                _file.icon = icon;

                return _file;
            }

            // Result
            var result            = {};
            result.name           = '';
            result.files          = {};
            result.files_count    = 0;
            result.tree           = new FileTree( { auto_wash: false } );
            result.date_formated  = '';
            result.on_update      = null;
            result.on_new_version = null;

            // Connect
            result.connect = function( project_name )
            {
                // Connect to socket
                var socket = io( config.domain + '/project/' + project_name );

                // Connect event
                socket.on( 'connect', function()
                {

                } );

                socket.on( 'create_file', function( data )
                {
                    var file = result.files[ data.path.full ];

                    // Doesn't exist yet
                    if( typeof file === 'undefined' )
                    {
                        file = Object.assign( {}, data );
                        file = reformat_file( file );

                        result.files[ data.path.full ] = file;

                        result.tree.add_file( data.path.full, file )

                        result.files_count++;
                    }

                    // Apply callback
                    if( typeof result.on_update === 'function' )
                        result.on_update.apply( this, [ data ] );
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
                        if( typeof result.on_update === 'function' )
                            result.on_update.apply( this, [ data ] );

                        if( typeof result.on_new_version === 'function' )
                            result.on_new_version.apply( this, [ data ] );
                    }
                } );

                socket.on( 'delete_file', function( data )
                {
                    var file = result.files[ data.path.full ];

                    // Doesn't exist yet
                    if( typeof file !== 'undefined' )
                    {
                        result.tree.remove_file( file.path.full )

                        result.files_count--;

                        delete result.files[ data.path.full ]

                        // Apply callback
                        if( typeof result.on_update === 'function' )
                            result.on_update.apply( this, [ data ] );
                    }
                } );

                // Update project event
                socket.on( 'update_project', function( data )
                {
                    result.name        = data.name;
                    result.files_count = data.files.count;

                    // Date
                    result.moment_date   = moment( data.date );
                    result.date_formated = result.moment_date.format( 'LTS' );
                    result.time_from_now = result.moment_date.fromNow();

                    // Last update date
                    result.last_update_moment_date   = moment( data.last_update_date );
                    result.last_update_date_formated = result.last_update_moment_date.format( 'LTS' );
                    result.last_update_time_from_now = result.last_update_moment_date.fromNow();

                    // Duplicate files
                    for( var _file_key in data.files.items )
                    {
                        var data_file = data.files.items[ _file_key ],
                            file      = result.files[ _file_key ];

                        // Doesn't exist yet
                        if( typeof file === 'undefined' )
                        {
                            file = Object.assign( {}, data_file );
                            file = reformat_file( file );

                            result.files[ _file_key ] = file;

                            result.tree.add_file( _file_key, file )
                        }
                    }

                    // Apply callback
                    if( typeof result.on_update === 'function' )
                        result.on_update.apply( this, [ data ] );
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

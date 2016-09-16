application.factory(
    'projects',
    [
        'config',
        function( config )
        {
            // Reformat project function
            function reformat_project( _project )
            {
                // Date
                _project.moment_date   = moment( _project.date );
                _project.date_formated = _project.moment_date.format( 'LTS' );
                _project.time_from_now = _project.moment_date.fromNow();

                // Last update date
                _project.last_update_moment_date   = moment( _project.last_update_date );
                _project.last_update_date_formated = _project.last_update_moment_date.format( 'LTS' );
                _project.last_update_time_from_now = _project.last_update_moment_date.fromNow();

                return _project;
            }

            // Result
            var result       = {};
            result.data      = {};
            result.on_update = null;

            // Socket
            var socket = io( config.domain + '/projects' );

            socket.on( 'update_projects', function( data )
            {
                result.data = data;

                console.log(data);

                for( var _project_key in result.data.all )
                {
                    var project = result.data.all[ _project_key ];
                    project = reformat_project( project );
                }


                if( typeof result.on_update === 'function' )
                    result.on_update.apply( this, [ data ] );
            } );

            // Return
            return result;
        }
    ]
);

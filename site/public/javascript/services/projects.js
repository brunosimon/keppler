application.factory(
    'projects',
    [
        'config',
        function( config )
        {
            update_callback = null;

            // Result
            var result       = {};
            result.data      = {};
            result.on_update = function( callback )
            {
                update_callback = callback;
            };

            // Socket
            var socket = io( config.domain + '/projects' );

            socket.on( 'update_projects', function( data )
            {
                result.data = data;

                if( typeof update_callback === 'function' )
                    update_callback.apply( this, [ data ] );
            } );

            // Return
            return result;
        }
    ]
);

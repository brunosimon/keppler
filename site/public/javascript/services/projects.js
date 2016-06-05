angular_module.factory(
    'projects',
    [
        '$timeout',
        '$rootScope',
        function( $timeout, $rootScope )
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
            var socket = io( 'http://192.168.1.4:3000/projects' );

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

angular_module.factory(
    'project',
    [
        '$timeout',
        function( $timeout )
        {
            update_callback = null;

            var result       = {};
            result.data      = null;
            result.on_update = function( callback )
            {
                update_callback = callback;
            };
            result.connect = function( project_name )
            {
                var socket = io( 'http://192.168.1.4:3000/project/' + project_name );

                socket.on( 'connect', function()
                {
                    console.log('connected');
                } );

                socket.on( 'update_project', function( data )
                {
                    result.data = data;

                    if( typeof update_callback === 'function' )
                        update_callback.apply( this, [ data ] );
                } );

            };

            result.data = {"name":"","folders":{}};

            return result;
        }
    ]
);

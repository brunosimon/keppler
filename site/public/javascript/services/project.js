angular_module.factory(
    'project',
    [
        '$timeout',
        '$rootScope',
        function( $timeout, $rootScope )
        {
            update_callback = null;

            var result       = {};
            result.data      = null;
            result.on_update = function( callback )
            {
                update_callback = callback;
            };

            var socket = io( 'http://192.168.1.4:3000/site' );

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

            result.data = {"name":"pwet","folders":{".":{"name":".","files":{"test-1.txt":{"name":"test-1.txt","versions":[{"date":"2016-06-04T23:26:45.759Z","content":"dsfsdf\n\naaaa\n\ndsfsdf\n\nbbbbiuhsdfiuhsdfdsf\n\n\ndsfsdf\nsodifja\n","diff":false}]}},"folders":{"folder-2":{"name":"folder-2","files":{"hey.txt":{"name":"hey.txt","versions":[{"date":"2016-06-04T23:26:41.642Z","content":"qdsqsdsq\n","diff":false}]}},"folders":{}},"folder-1":{"name":"folder-1","files":{"test-4.txt":{"name":"test-4.txt","versions":[{"date":"2016-06-04T23:26:46.571Z","content":"sdnufoisdf\n","diff":false}]}},"folders":{}}}}}};

            return result;
        }
    ]
);

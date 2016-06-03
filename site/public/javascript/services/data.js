angular_module.factory(
    'data',
    [
        function()
        {
            return function()
            {
                console.log( 'data' );
            }
        }
    ]
);

angular_module.controller(
    'ProjectController',
    [
        '$scope',
        'project',
        function( $scope, project )
        {
            update_callback = null;

            // Result
            var result       = {};
            result.data      = {};
            result.on_update = function( callback )
            {
                update_callback = callback;
            };

            $scope.folder_click = function( folder )
            {
                console.log( folder );
            };

            $scope.file_click = function( file )
            {
                console.log( file );
            };

            project.on_update( function( data )
            {
                $scope.$apply( function()
                {
                    $scope.project = data;
                } );
            } );

            this.project = project.data;
        }
    ]
);

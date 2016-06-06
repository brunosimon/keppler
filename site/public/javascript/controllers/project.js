angular_module.controller(
    'ProjectController',
    [
        '$scope',
        'project',
        function( $scope, project )
        {
            $scope.folder_click = function( folder )
            {
                console.log( folder );
            };

            $scope.file_click = function( file )
            {
                console.log( file );
            };

            $scope.init = function( project_slug )
            {
                project.connect( project_slug );
            };

            project.on_update( function( data )
            {
                $scope.$apply( function()
                {
                    $scope.project = data;
                } );
            } );

            $scope.project = project.data;
        }
    ]
);

angular_module.controller(
    'ProjectsController',
    [
        '$scope',
        'projects',
        function( $scope, projects )
        {
            projects.on_update( function( data )
            {
                $scope.$apply( function()
                {
                    $scope.projects = Object.keys( data.all ).length ? data.all : null;
                } );
            } );

            $scope.projects = projects.data.all
        }
    ]
);

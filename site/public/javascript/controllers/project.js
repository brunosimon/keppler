application.controller(
    'ProjectController',
    [
        '$scope',
        '$interval',
        'project',
        function( $scope, $interval, project )
        {
            // Every 5 seconds
            $interval( function()
            {
                // // Each version
                // project.each_version( function( version )
                // {
                //     // Date
                //     version.time_from_now = version.moment_date.fromNow();
                // } );
            }, 5000 );

            $scope.folder_click = function( folder )
            {
                console.log('folder click');
                // folder.active = !folder.active;
            };

            $scope.file_click = function( file )
            {
                file = file.data;
                file.notif = 0;

                // file.active = true;
                $scope.file    = file;
                $scope.version = file.versions[ file.versions.length - 1 ];
            };

            $scope.version_click = function( version )
            {
                $scope.version = version;
            };

            $scope.init = function( project_slug )
            {
                project.connect( project_slug );
            };

            project.on_update( function( data )
            {
                $scope.$apply( function()
                {
                    $scope.project = project;
                } );
            } );

            $scope.project = project.data;
            $scope.file    = null;
            $scope.version = null;
        }
    ]
);

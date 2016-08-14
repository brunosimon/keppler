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
                // Each file
                for( var _file_key in project.files )
                {
                    var _file = project.files[ _file_key ];

                    // Each version
                    for( var _version_key in _file.versions )
                    {
                        var _version = _file.versions[ _version_key ];
                        // Date
                        _version.time_from_now = _version.moment_date.fromNow();
                    }
                }
            }, 5000 );

            $scope.always_last_version_toggle_click = function()
            {
                $scope.always_last_version = !$scope.always_last_version;
            };

            $scope.folder_click = function( folder )
            {
                // console.log('folder click');
                // folder.active = !folder.active;
            };

            $scope.file_click = function( file )
            {
                // File
                if( $scope.file )
                    $scope.file.active = false;

                file        = file.data;
                file.notif  = 0;
                file.new    = false;
                file.active = true;
                $scope.file = file;

                // Version
                if( $scope.version )
                    $scope.version.active = false;

                $scope.version = file.versions[ file.versions.length - 1 ];
                $scope.version.active = true
            };

            $scope.version_click = function( version )
            {
                if( $scope.version )
                    $scope.version.active = false;

                version.active = true;
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
                } );
            } );

            $scope.project             = project;
            $scope.file                = null;
            $scope.always_last_version = true;
            $scope.version             = null;
        }
    ]
);

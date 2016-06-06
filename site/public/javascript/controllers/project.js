angular_module.controller(
    'ProjectController',
    [
        '$scope',
        'project',
        function( $scope, project )
        {
            $scope.folder_click = function( folder )
            {
                project.each_folder( function( folder )
                {
                    folder.active = false;
                } );

                folder.active = true;
            };

            $scope.file_click = function( file )
            {
                project.each_file( function( file )
                {
                    file.active = false;
                } );

                file.active = true;
                $scope.file = file;
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
                    $scope.project = data;
                } );
            } );

            $scope.project = project.data;
            $scope.file    = null;
            $scope.version = null;
        }
    ]
);

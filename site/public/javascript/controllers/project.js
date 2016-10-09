application.controller(
    'ProjectController',
    [
        '$scope',
        '$interval',
        'project',
        'clipboard',
        function( $scope, $interval, project, clipboard )
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

            $scope.show_differences_toggle_click = function()
            {
                $scope.show_differences = !$scope.show_differences;
            };

            $scope.mark_all_as_read_click = function()
            {
                // Each file
                for( var _file_key in project.files )
                {
                    var _file = project.files[ _file_key ];

                    _file.notif = 0
                    _file.new   = false
                }
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

                if( file.versions.length )
                {
                    $scope.version        = file.versions[ file.versions.length - 1 ];
                    $scope.version.active = true
                }
                else
                {
                    $scope.version = null;
                }
            };

            $scope.version_click = function( version )
            {
                if( $scope.version )
                    $scope.version.active = false;

                version.active = true;
                $scope.version = version;

                $scope.file.notif = 0;
            };

            $scope.copy           = {};
            $scope.copy.text      = 'copy';
            $scope.copy.supported = clipboard.supported;
            $scope.copy_to_clipboard_click = function()
            {
                $scope.copy.text = 'copied';
                clipboard.copyText( $scope.version.content );
            };
            $scope.copy_to_clipboard_mouseleave = function()
            {
                $scope.copy.text = 'copy';
            };

            $scope.init = function( project_slug )
            {
                project.connect( project_slug );
            };

            project.on_update = function( data )
            {
                $scope.$apply( function()
                {
                } );
            };

            project.on_new_version = function( data )
            {
                // Should open last version
                if( $scope.always_last_version )
                {
                    // Same file
                    if( $scope.file && $scope.file.path.full === data.file )
                    {
                        $scope.$apply( function()
                        {
                            if( $scope.version )
                                $scope.version.active = false;

                            $scope.version = data.version;
                            $scope.version.active = true;

                            $scope.file.notif = 0;
                        } );
                    }
                }
            };

            $scope.project             = project;
            $scope.file                = null;
            $scope.always_last_version = true;
            $scope.show_differences    = true;
            $scope.version             = null;
        }
    ]
);

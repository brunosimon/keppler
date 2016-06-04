var angular_module = angular.module( 'application', [] );

angular_module.controller(
    'ApplicationController',
    [
        '$scope',
        'project',
        function( $scope, project )
        {
            var that = this;

            project.on_update( function( data )
            {
                $scope.$apply( function()
                {
                    that.project = data;
                } );
            } );

            this.project = project.data;
        }
    ]
);

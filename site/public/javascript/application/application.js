var angular_module = angular.module( 'application', [] );

angular_module.controller(
    'ApplicationController',
    [
        '$scope',
        'data',
        function( $scope, data )
        {
            console.log(data);

            this.pwet = 'uh';
            this.codes =
            [
                { title: 'Title 1' },
                { title: 'Title 2' }
            ];
        }
    ]
);

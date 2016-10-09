var application = angular.module(
    'application',
    [
        'hljs',
        'angular-clipboard'
    ]
);

application.constant( 'config', config );
application.config( function( hljsServiceProvider )
{
    hljsServiceProvider.setOptions({
        // replace tab with 4 spaces
        tabReplace: '    '
    } );
} );

'use strict'

class Event_Emitter
{
    /**
     * Constructor
     */
    constructor()
    {
        this.callbacks      = {}
        this.callbacks.base = {}
    }

    /**
     * On
     */
    on( names, callback )
    {
        let that = this

        // Errors
        if( typeof names === 'undefined' || names === '' )
        {
            console.warn( 'wrong names' )
            return false
        }

        if( typeof callback === 'undefined' )
        {
            console.warn( 'wrong callback' )
            return false
        }

        // Resolve names
        names = this.resolve_names( names )

        // Each name
        names.forEach( function( name )
        {
            // Resolve name
            name = that.resolve_name( name )

            // Create namespace if not exist
            if( !( that.callbacks[ name.namespace ] instanceof Object ) )
                that.callbacks[ name.namespace ] = {}

            // Create callback if not exist
            if( !( that.callbacks[ name.namespace ][ name.value ] instanceof Array ) )
                that.callbacks[ name.namespace ][ name.value ] = []

            // Add callback
            that.callbacks[ name.namespace ][ name.value ].push( callback )
        })

        return this
    }

    /**
     * Off
     */
    off( names )
    {
        let that = this

        // Errors
        if( typeof names === 'undefined' || names === '' )
        {
            console.warn( 'wrong name' )
            return false
        }

        // Resolve names
        names = this.resolve_names( names )

        // Each name
        names.forEach( function( name )
        {
            // Resolve name
            name = that.resolve_name( name )

            // Remove namespace
            if( name.namespace !== 'base' && name.value === '' )
            {
                delete that.callbacks[ name.namespace ]
            }

            // Remove specific callback in namespace
            else
            {
                // Default
                if( name.namespace === 'base' )
                {
                    // Try to remove from each namespace
                    for( let namespace in that.callbacks )
                    {
                        if( that.callbacks[ namespace ] instanceof Object && that.callbacks[ namespace ][ name.value ] instanceof Array )
                        {
                            delete that.callbacks[ namespace ][ name.value ]

                            // Remove namespace if empty
                            if( Object.keys(that.callbacks[ namespace ] ).length === 0 )
                                delete that.callbacks[ namespace ]
                        }
                    }
                }

                // Specified namespace
                else if( that.callbacks[ name.namespace ] instanceof Object && that.callbacks[ name.namespace ][ name.value ] instanceof Array )
                {
                    delete that.callbacks[ name.namespace ][ name.value ]

                    // Remove namespace if empty
                    if( Object.keys( that.callbacks[ name.namespace ] ).length === 0 )
                        delete that.callbacks[ name.namespace ]
                }
            }
        })

        return this
    }

    /**
     * Trigger
     */
    trigger( name, args )
    {
        // Errors
        if( typeof name === 'undefined' || name === '' )
        {
            console.warn( 'wrong name' )
            return false
        }

        let that         = this,
            final_result,
            result

        // Default args
        if( !( args instanceof Array ) )
            args = []

        // Resolve names (should on have one event)
        name = this.resolve_names( name )

        // Resolve name
        name = that.resolve_name( name[ 0 ] )

        // Default namespace
        if( name.namespace === 'base' )
        {
            // Try to find callback in each namespace
            for( let namespace in that.callbacks )
            {
                if( that.callbacks[ namespace ] instanceof Object && that.callbacks[ namespace ][ name.value ] instanceof Array )
                {
                    that.callbacks[ namespace ][ name.value ].forEach( function( callback )
                    {
                        result = callback.apply( that,args )

                        if( typeof final_result === 'undefined' )
                            final_result = result
                    } )
                }
            }
        }

        // Specified namespace
        else if( this.callbacks[ name.namespace ] instanceof Object )
        {
            if( name.value === '' )
            {
                console.warn( 'wrong name' )
                return this
            }

            that.callbacks[ name.namespace ][ name.value ].forEach( function( callback )
            {
                result = callback.apply( that, args )

                if( typeof final_result === 'undefined' )
                    final_result = result
            })
        }

        return final_result
    }

    /**
     * Resolve names
     */
    resolve_names( names )
    {
        names = names.replace( /[^a-zA-Z0-9 ,\/.]/g, '' )
        names = names.replace( /[,\/]+/g, ' ' )
        names = names.split( ' ' )

        return names
    }

    /**
     * Resolve name
     */
    resolve_name( name )
    {
        let new_name = {},

        parts = name.split( '.' )

        new_name.original  = name
        new_name.value     = parts[ 0 ]
        new_name.namespace = 'base' // Base namespace

        // Specified namespace
        if( parts.length > 1 && parts[ 1 ] !== '' )
            new_name.namespace = parts[ 1 ]

        return new_name
    }
}

module.exports = Event_Emitter

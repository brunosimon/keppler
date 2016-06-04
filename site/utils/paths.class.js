'use strict'

// Dependencies
let path = require( 'path' )

class Paths
{
    constructor()
    {
        this.separator = path.sep
    }

    normalize( _path )
    {
        if( _path === '.' || _path === '' )
            return '.';

        let normalized_path = './' + path.normalize( _path )

        return normalized_path
    }

    parse( _path )
    {
        let normalized_path = this.normalize( _path ),
            parsed_path     = path.parse( normalized_path )

        return parsed_path
    }
}

let paths = new Paths()

module.exports = paths

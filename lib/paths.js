// Dependencies
const path = require('path')

class Paths
{
    constructor()
    {
        this.separator = path.sep
    }

    normalize(_path)
    {
        if(_path === '.' || _path === '')
        {
            const path = '.'

            return path
        }

        const normalizedPath = './' + path.normalize(_path)

        return normalizedPath
    }

    parse(_path)
    {
        const normalizedPath = this.normalize(_path)
        const parsedPath = path.parse(normalizedPath)

        return parsedPath
    }
}

const paths = new Paths()

module.exports = paths

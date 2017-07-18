'use strict'

// Depedencies
const diff = require('diff')
const ids = require('../utils/ids.js')

class File
{
    constructor(_options)
    {
        // Set up
        this.id             = ids.get_id()
        this.name           = _options.name
        this.path           = {}
        this.path.directory = _options.path
        this.path.full      = this.path.directory + '/' + this.name
        this.versions       = []
        this.socket         = _options.socket

        const nameParts = this.name.split('.')

        if(nameParts.length > 1)
        {
            this.extension = nameParts[ nameParts.length - 1 ]
        }
        else
        {
            this.extension = ''
        }

        // Create first version
        if(typeof _options.content !== 'undefined')
        {
            this.createVersion(_options.content)
        }
    }

    createVersion(content)
    {
        // Create version
        const version = {}
        const lastVersion = this.getLastVersion()

        version.date = new Date()
        version.content = content

        if(!lastVersion)
        {
            version.diff = false
        }
        else if(version.content === '')
        {
            version.diff = [{ count: 1, added: true, removed: undefined, value: 'a' }]

            if(lastVersion.content === '')
            {
                return false
            }
        }
        else
        {
            version.diff = diff.diffLines(
                lastVersion.content,
                version.content,
                {
                    // ignoreWhitespace: true
                }
            )

            // No changed
            if(version.diff.length === 1 && lastVersion.content !== '')
            {
                return false
            }
        }

        // Emit
        this.socket.emit('createVersion', { file: this.path.full, version })

        // Save
        this.versions.push(version)
    }

    getLastVersion()
    {
        if(this.versions.length === 0)
            return false

        return this.versions[ this.versions.length - 1 ]
    }

    describe()
    {
        // Set up
        const result = {}

        result.id        = this.id
        result.name      = this.name
        result.path      = this.path
        result.versions  = this.versions
        result.extension = this.extension

        return result
    }

    destructor()
    {

    }
}

module.exports = File

'use strict'

// Dependencies
const slug = require('slug')
const Files = require('./files.js')

class Project
{
    constructor(_options)
    {
        this.setOptions(_options)
        this.setName(_options.name)
        this.setSocket(_options.socket)

        this.files = new Files({ socket: this.socket })
        this.date  = new Date()
    }

    /**
     * Set options
     */
    setOptions(_options)
    {
        if(typeof _options.debug === 'undefined')
        {
            _options.debug = false
        }

        // Save
        this.options = _options
    }

    setName(_name)
    {
        this.name = _name
        this.slug = slug(this.name, { lower: true })
    }

    setSocket(socket)
    {
        // Set up
        this.originalSocket = socket
        this.socket = this.originalSocket.of('/project/' + this.slug)

        // Connection event
        this.socket.on('connection', (socket) =>
        {
            this.socket.emit('update_project', this.describe())

            // Debug
            if(this.options.debug)
            {
                console.log('socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan)
            }
        })
    }

    describe()
    {
        // Set up
        const result = {}

        result.name  = this.name
        result.files = this.files.describe()
        result.date  = this.date

        return result
    }

    destructor()
    {
        this.socket.emit('destruct')
    }
}

module.exports = Project

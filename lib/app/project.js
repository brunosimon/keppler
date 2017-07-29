'use strict'

// Dependencies
const slug = require('slug')
const Files = require('./files.js')

class Project
{
    constructor(_config, _options)
    {
        this.config = _config

        this.setName(_options.name)
        this.setSocket()

        this.files = new Files(this.config, { projectSocket: this.projectSocket })
        this.date  = new Date()
    }

    setName(_name)
    {
        this.name = _name
        this.slug = slug(this.name, { lower: true })
    }

    setSocket()
    {
        // Save original socket and create a channel for this specific project
        this.projectSocket = this.config.socket.of('/project/' + this.slug)

        // Connection event
        this.projectSocket.on('connection', (socket) =>
        {
            this.projectSocket.emit('update_project', this.describe())

            // Debug
            if(this.config.debug >= 1)
            {
                console.log('project > socket'.green.bold + ' - ' + 'connection'.cyan + ' - ' + socket.id.cyan)
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
        this.projectSocket.emit('destruct')
    }
}

module.exports = Project

'use strict'

const Project = require('./project.js')

class Projects
{
    constructor(_options)
    {
        this.all = {}

        this.setOptions(_options)
        this.setSocket(_options.socket)
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

    setSocket(socket)
    {
        // Set up
        this.originalSocket = socket
        this.socket = this.originalSocket.of('/projects')

        // Connection event
        this.socket.on('connection', (socket) =>
        {
            this.socket.emit('update_projects', this.describe())

            if(this.options.debug)
            {
                console.log('socket projects'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan)
            }
        })
    }

    createProject(_name)
    {
        // Create project
        const project = new Project({ name: _name, socket: this.originalSocket, debug: this.options.debug })
        let sameNameProject = this.all[ project.slug ]

        // Try to found same name project
        while(typeof sameNameProject !== 'undefined')
        {
            // Found new number
            let lastNumber = sameNameProject.name.match(/\d+$/)
            let newNumber  = 2

            if(lastNumber && lastNumber.length)
            {
                lastNumber = ~~lastNumber[ 0 ]

                newNumber = lastNumber + 1
            }

            // Update project name
            project.set_name(_name + ' ' + newNumber)

            // Try to found
            sameNameProject = this.all[ project.slug ]
        }

        // Save
        this.all[ project.slug ] = project

        // Emit
        this.socket.emit('update_projects', this.describe())

        // Return
        return project
    }

    deleteProject(_slug)
    {
        // Set up
        const project = this.all[ _slug ]

        // Project found
        if(typeof project !== 'undefined')
        {
            // Delete
            delete this.all[ _slug ]
            project.destructor()

            // Emit
            this.socket.emit('update_projects', this.describe())
        }
    }

    getProjectBySlug(_slug)
    {
        // Find project
        const project = this.all[ _slug ]

        // Found
        if(project)
        {
            return project
        }

        // Not found
        return false
    }

    describe()
    {
        const result = {}
        result.all = {}

        for(const _slug in this.all)
        {
            const _project = this.all[ _slug ]

            result.all[ _slug ] = {
                slug: _project.slug,
                name: _project.name,
                filesCount: _project.files.count,
                date: _project.date,
                lastUpdateDate: _project.files.last_version_date
            }
        }

        return result
    }
}

module.exports = Projects

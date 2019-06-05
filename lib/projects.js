const Project = require('./project.js')
const chalk = require('chalk')

class Projects
{
    constructor(_config)
    {
        this.config = _config
        this.all = {}

        this.setSocket()
    }

    setSocket()
    {
        // Save original socket and create a channel for projects
        this.projectsSocket = this.config.socket.of('/projects')

        // Callbacks
        this.socketCallbacks = {}
        this.socketCallbacks.connection = (socket) =>
        {
            // // Send the config to the new socket
            socket.emit('config', { domain: this.config.domain, server: this.config.server })

            // Send the projects update to all users
            this.projectsSocket.emit('update_projects', this.describe())

            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('projects > socket')} - ${chalk.cyan('connection')} - ${chalk.cyan(socket.id)}`)
            }
        }

        // Connection event
        this.projectsSocket.on('connection', this.socketCallbacks.connection)
    }

    createProject(_options)
    {
        // Create project
        const project = new Project(this.config, _options)
        let sameNameProject = this.all[project.slug]

        // Try to found same name project
        while(typeof sameNameProject !== 'undefined')
        {
            // Found new number
            let lastNumber = sameNameProject.name.match(/\d+$/)
            let newNumber  = 2

            if(lastNumber && lastNumber.length)
            {
                lastNumber = ~~lastNumber[0]

                newNumber = lastNumber + 1
            }

            // Update project name
            project.setName(_options.name + ' ' + newNumber)

            // Try to found
            sameNameProject = this.all[project.slug]
        }

        // Save
        this.all[project.slug] = project

        // Emit
        this.projectsSocket.emit('update_projects', this.describe())

        // Return
        return project
    }

    deleteProject(_slug)
    {
        // Set up
        const project = this.all[_slug]

        // Project found
        if(typeof project !== 'undefined')
        {
            // Delete
            delete this.all[_slug]
            project.destructor()

            // Emit
            this.projectsSocket.emit('update_projects', this.describe())
        }
    }

    getProjectBySlug(_slug)
    {
        // Find project
        const project = this.all[_slug]

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
        result.domain = this.config.domain
        result.all = {}

        for(const _slug in this.all)
        {
            const _project = this.all[_slug]

            result.all[_slug] = {
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

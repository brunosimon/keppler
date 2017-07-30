'use strict'

// Dependencies
const slug = require('slug')
const Files = require('./files.js')
const AdmZip = require('adm-zip')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

class Project
{
    constructor(_config, _options)
    {
        this.config = _config

        this.zipNeedsUpdate = true
        this.name = _options.name
        this.path = _options.path
        this.excludeRegex = new RegExp(_options.excludeRegex)
        this.slug = slug(this.name, { lower: true })

        this.setSocket()

        this.files = new Files(this.config, { projectSocket: this.projectSocket })
        this.date  = new Date()
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

    getZipBuffer()
    {
        // Already zipped and don't need update
        if(!this.zipNeedsUpdate)
        {
            // Debug
            if(this.config.debug >= 1)
            {
                console.log('project > zip'.green.bold + ' - ' + 'from cache'.cyan)
            }

            return this.zipBuffer
        }

        // Search files with glob
        const files = glob.sync(this.path + '/**', { dot: true })

        // Create a zip file
        const zip = new AdmZip()

        // Add files to zip
        for(const _file of files)
        {
            const stats = fs.lstatSync(_file)

            // Ignore if folder or exluded
            if(stats.isFile() && !_file.match(this.excludeRegex))
            {
                const basename = path.basename(_file)
                const relativePath = _file.replace(basename, '').replace(this.path, '')
                zip.addLocalFile(_file, relativePath)
            }
        }

        // Create and return zip buffer
        this.zipBuffer = zip.toBuffer()
        this.zipNeedsUpdate = false

        // Debug
        if(this.config.debug >= 1)
        {
            console.log('project > zip'.green.bold + ' - ' + 'create'.cyan)
        }

        return this.zipBuffer
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

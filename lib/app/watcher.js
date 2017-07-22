'use strict'

// Depedencies
const chokidar = require('chokidar')
const ip = require('ip')
const socketIoClient = require('socket.io-client')
const fs = require('fs')
const mime = require('mime')
const EventEmitter = require('../event-emitter.js')

/**
 * Watcher class
 */
class Watcher extends EventEmitter
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        super()

        this.setOptions(_options)
        this.setWatcher()
        this.setSocket()
    }

    /**
     * Set options
     */
    setOptions(_options)
    {
        const options = typeof _options !== 'object' ? {} : _options

        // Defaults
        if(typeof options.debug === 'undefined')
        {
            options.debug = false
        }

        if(typeof options.port === 'undefined')
        {
            options.port = 1571
        }

        if(typeof options.domain === 'undefined')
        {
            options.domain = `http://${ip.address()}:${options.port}`
        }

        if(typeof options.maxFileSize === 'undefined')
        {
            options.maxFileSize = 2000
        }

        // Save
        this.options = options
    }

    /**
     * Set socket
     * Connect to site
     */
    setSocket()
    {
        // Set up
        this.socket = socketIoClient(`${this.options.domain}/app`)

        // Connect event
        this.socket.on('connect', () =>
        {
            this.socket.emit('start_project', { name: this.options.name })

            // Debug
            if(this.options.debug)
            {
                console.log('connected'.green.bold)
            }
        })
    }

    /**
     * Set watcher
     * Listen to modifications on file and folders
     */
    setWatcher()
    {
        // Create ignored regex
        const regexs    = []
        const Minimatch = require('minimatch').Minimatch

        for(const _excludeKey in this.options.exclude)
        {
            const _exclude = this.options.exclude[ _excludeKey ]
            const minimatch = new Minimatch(_exclude, { dot: true })
            
            let regex = '' + minimatch.makeRe()

            regex = regex.replace('/^', '')
            regex = regex.replace('$/', '')

            regexs.push(regex)
        }

        const regex = new RegExp(regexs.join('|'))

        // Set up
        this.watcher = chokidar.watch(
            process.cwd(),
            {
                // ignored      : /[\/\\]\./,
                ignored      : regex,
                ignoreInitial: true
            }
        )

        // Add event
        this.watcher.on('add', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')
            const mimeType = mime.lookup(relativePath)
            const file = {}

            file.path     = relativePath
            file.canRead = true

            // Test mime type
            if(mimeType.match(/^(audio)|(video)|(image)/))
            {
                file.canRead = false
            }

            // Retrieve stats
            fs.stat(_path, (error, stats) =>
            {
                // Max file size
                if(this.options.maxFileSize < stats.size)
                {
                    file.canRead = false
                }

                // Read
                fs.readFile(_path, (error, data) =>
                {
                    if(file.canRead)
                    {
                        file.content = data.toString()
                    }

                    // Send
                    this.socket.emit('create_file', file)
                })
            })

            // Debug
            if(this.options.debug)
            {
                console.log('add:'.green.bold, relativePath)
            }
        })

        // Change event
        this.watcher.on('change', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')
            const mimeType = mime.lookup(relativePath)
            const file = {}

            file.path = relativePath
            file.canRead = true

            // Test mime type
            if(mimeType.match(/^(audio)|(video)|(image)/))
            {
                file.canRead = false
            }

            // Retrieve stats
            fs.stat(_path, (error, stats) =>
            {
                // Test max file size
                if(this.options.maxFileSize < stats.size)
                {
                    file.canRead = false
                }

                // Read
                fs.readFile(_path, (error, data) =>
                {
                    if(file.canRead)
                    {
                        file.content = data.toString()
                    }

                    // Send
                    this.socket.emit('update_file', file)
                })
            })

            // Debug
            if(this.options.debug)
            {
                console.log('change:'.green.bold, relativePath)
            }
        })

        // Unlink event
        this.watcher.on('unlink', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Send
            this.socket.emit('delete_file', { path: relativePath })

            // Debug
            if(this.options.debug)
            {
                console.log('unlink:'.green.bold, relativePath)
            }
        })

        // AddDir event
        this.watcher.on('addDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Send
            this.socket.emit('create_folder', { path: relativePath })

            // Debug
            if(this.options.debug)
            {
                console.log('addDir:'.green.bold, relativePath)
            }
        })

        // UnlinkDir event
        this.watcher.on('unlinkDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Send
            this.socket.emit('delete_folder', { path: relativePath })

            // Debug
            if(this.options.debug)
            {
                console.log('unlinkDir:'.green.bold, relativePath)
            }
        })
    }
}

module.exports = Watcher

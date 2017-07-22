'use strict'

// Depedencies
const chokidar = require('chokidar')
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
    constructor(_config)
    {
        super()

        this.config = _config

        this.watch()
    }

    /**
     * Watch
     * Listen to modifications on files and folders
     */
    watch()
    {
        // Create ignored regex
        const regexs    = []
        const Minimatch = require('minimatch').Minimatch

        for(const _excludeKey in this.config.exclude)
        {
            const _exclude = this.config.exclude[_excludeKey]
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
                if(this.config.maxFileSize < stats.size)
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

                    // Trigger
                    this.trigger('create_file', [file])
                })
            })

            // Debug
            if(this.config.debug)
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
                if(this.config.maxFileSize < stats.size)
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

                    // Trigger
                    this.trigger('update_file', [file])
                })
            })

            // Debug
            if(this.config.debug)
            {
                console.log('change:'.green.bold, relativePath)
            }
        })

        // Unlink event
        this.watcher.on('unlink', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Trigger
            this.trigger('delete_file', [relativePath])

            // Debug
            if(this.config.debug)
            {
                console.log('unlink:'.green.bold, relativePath)
            }
        })

        // AddDir event
        this.watcher.on('addDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Trigger
            this.trigger('create_folder', [{ path: relativePath }])

            // Debug
            if(this.config.debug)
            {
                console.log('addDir:'.green.bold, relativePath)
            }
        })

        // UnlinkDir event
        this.watcher.on('unlinkDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(process.cwd(), '.')

            // Trigger
            this.trigger('delete_folder', [{ path: relativePath }])

            // Debug
            if(this.config.debug)
            {
                console.log('unlinkDir:'.green.bold, relativePath)
            }
        })
    }
}

module.exports = Watcher

// Depedencies
const chokidar = require('chokidar')
const fs = require('fs')
const mime = require('mime')
const socketIoClient = require('socket.io-client')
const opener = require('opener')
const nodeNotifier = require('node-notifier')
const path = require('path')
const chalk = require('chalk')

/**
 * Watcher class
 */
class Watcher
{
    /**
     * Constructor
     */
    constructor(_config)
    {
        this.config = _config
        this.path = process.cwd()

        this.setExcludeRegex()
        this.setSocket()
        this.watch()
    }

    /**
     * Set socket
     */
    setSocket()
    {
        // Connect to watcher socket
        this.socket = socketIoClient(`${this.config.domain}/watcher`)

        // Connect event
        this.socket.on('connect', () =>
        {
            let name = this.config.name

            // If no name, use folder name
            if(!name)
            {
                name = path.parse(this.path).name
            }

            this.socket.emit('start_project', { name, path: this.path, excludeRegex: '' + this.excludeRegex })

            // Debug
            if(this.config.debug)
            {
                console.log(`${chalk.green.bold('watcher > socket')} - ${chalk.cyan('connect')}`)
            }
        })

        // Disconnect event
        this.socket.on('disconnect', () =>
        {
            // Debug
            if(this.config.debug)
            {
                console.log(`${chalk.green.bold('watcher > socket')} - ${chalk.cyan('disconnect')}`)
            }
        })

        // Started event
        this.socket.on('started', () =>
        {
            const url = this.config.domain
            console.log('app'.green.bold + ' - ' + url.yellow)

            if(this.config.open)
            {
                opener(url)
            }
        })

        // Alert event
        this.socket.on('alert', () =>
        {
            nodeNotifier.notify({
                title: 'Keppler',
                message: 'Alert!',
                icon: path.join(__dirname, 'assets/images/notification-icon-200x200.png'),
                wait: true
            })
        })
    }

    setExcludeRegex()
    {
        // Exclude files regex
        const regexs = []
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

        this.excludeRegex = new RegExp(regexs.join('|'))
    }

    /**
     * Watch
     * Listen to modifications on files and folders
     */
    watch()
    {
        // Set up
        this.watcher = chokidar.watch(
            this.path,
            {
                // ignored: /[\/\\]\./,
                ignored: this.excludeRegex,
                ignoreInitial: !this.config.initialSend
            }
        )

        if(this.config.debug >= 1)
        {
            console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('start watching')} - ${chalk.cyan(this.path)}`)
        }

        // Add event
        this.watcher.on('add', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(this.path, '.')
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

                    // Emit
                    this.socket.emit('create_file', file)
                })
            })

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('add')} - ${chalk.cyan(relativePath)}`)
            }
        })

        // Change event
        this.watcher.on('change', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(this.path, '.')
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

                    // Emit
                    this.socket.emit('update_file', file)
                })
            })

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('change')} - ${chalk.cyan(relativePath)}`)
            }
        })

        // Unlink event
        this.watcher.on('unlink', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(this.path, '.')

            // Emit
            this.socket.emit('delete_file', { path: relativePath })

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('unlink')} - ${chalk.cyan(relativePath)}`)
            }
        })

        // AddDir event
        this.watcher.on('addDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(this.path, '.')

            // Emit
            this.socket.emit('create_folder', { path: relativePath })

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('addDir')} - ${chalk.cyan(relativePath)}`)
            }
        })

        // UnlinkDir event
        this.watcher.on('unlinkDir', (_path) =>
        {
            // Set up
            const relativePath = _path.replace(this.path, '.')

            // Emit
            this.socket.emit('delete_folder', { path: relativePath })

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('unlinkDir')} - ${chalk.cyan(relativePath)}`)
            }
        })
    }
}

module.exports = Watcher

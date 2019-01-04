// Depedencies
const chokidar = require('chokidar')
const fs = require('fs')
const mime = require('mime')
const socketIoClient = require('socket.io-client')
const opener = require('opener')
const nodeNotifier = require('node-notifier')
const path = require('path')
const chalk = require('chalk')
const globby = require('globby')

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
     * Set exclude regex
     * Because chakodar doesn't support dot files with glob pattern
     */
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

            this.socket.emit('start_project', { name, path: this.path, exclude: this.config.exclude })

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
            console.log(`${chalk.green.bold('app')} - ${chalk.yellow.underline(url)}`)

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

    /**
     * Watch
     * Listen to modifications on files and folders
     */
    watch()
    {
        const globPattern = ['**', ...this.config.exclude.map((item) => `!${item}`)]
        const files = globby.sync(globPattern, { dot: true })
        const ignoreInitial = files.length > this.config.limit

        if(ignoreInitial)
        {
            console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('start wating')} - ${chalk.red(`File limit exceeded (${this.config.limit})`)}`)
        }

        // Set up
        this.watcher = chokidar.watch(
            this.path,
            {
                // ignored: /[\/\\]\./,
                ignored: this.excludeRegex,
                ignoreInitial: ignoreInitial,
                ignorePermissionErrors: true
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
            const mimeType = mime.getType(relativePath)
            const extension = path.extname(relativePath)
            const file = {}

            file.path = relativePath
            file.canRead = true

            // Test mime type
            if(mimeType && mimeType.match(/^(audio)|(video)|(image)/) && extension !== '.ts')
            {
                file.canRead = false
            }

            // Retrieve stats
            fs.stat(_path, (error, stats) =>
            {
                // Error
                if(error)
                {
                    console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('add')} - ${chalk.cyan(_path)} - ${chalk.red('error')}`)
                    return
                }

                // Max file size
                if(this.config.maxFileSize < stats.size)
                {
                    file.canRead = false
                }

                // Read
                fs.readFile(_path, (error, data) =>
                {
                    // Error
                    if(error)
                    {
                        console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('add')} - ${chalk.cyan(_path)} - ${chalk.red('error')}`)
                        return
                    }

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
            const mimeType = mime.getType(relativePath)
            const extension = path.extname(relativePath)
            const file = {}

            file.path = relativePath
            file.canRead = true

            // Test mime type
            if(mimeType && mimeType.match(/^(audio)|(video)|(image)/) && extension !== '.ts')
            {
                file.canRead = false
            }

            // Retrieve stats
            fs.stat(_path, (error, stats) =>
            {
                // Error
                if(error)
                {
                    console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('change')} - ${chalk.cyan(_path)} - ${chalk.red('error')}`)
                    return
                }

                // Test max file size
                if(this.config.maxFileSize < stats.size)
                {
                    file.canRead = false
                }

                // Read
                fs.readFile(_path, (error, data) =>
                {
                    // Error
                    if(error)
                    {
                        console.log(`${chalk.green.bold('watcher')} - ${chalk.cyan('change')} - ${chalk.cyan(_path)} - ${chalk.red('error')}`)
                        return
                    }

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

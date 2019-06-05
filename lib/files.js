// Dependencies
const paths = require('./paths.js')
const File = require('./file.js')

class Files
{
    constructor(_config, _options)
    {
        this.config = _config

        this.items = {}
        this.count = 0
        this.projectSocket = _options.projectSocket
        this.lastVersionDate = new Date()
    }

    create(_path, _content)
    {
        // Set up
        const normalizedPath = paths.normalize(_path)
        const parsedPath = paths.parse(normalizedPath)

        // Retrieve file
        let file = this.get(normalizedPath)

        // File already exist
        if(file)
        {
            return false
        }

        // Create
        file = new File({
            name: parsedPath.base,
            path: parsedPath.dir,
            content: _content,
            projectSocket: this.projectSocket
        })

        // Save
        this.items[ normalizedPath ] = file
        this.count++
        this.lastVersionDate = new Date()

        // Emit
        this.projectSocket.emit('create_file', file.describe())

        return file
    }

    createVersion(_path, _content)
    {
        // Set up
        const normalizedPath = paths.normalize(_path)

        // Retrieve file
        const file = this.get(normalizedPath, true)

        if(typeof _content !== 'undefined')
        {
            // Create version
            file.createVersion(_content)
        }

        // Save
        this.lastVersionDate = new Date()

        return file
    }

    get(_path, _forceCreation)
    {
        const forceCreation = typeof _forceCreation === 'undefined' ? false : _forceCreation

        // Set up
        const normalizedPath = paths.normalize(_path)

        // Retrieve file
        let file = this.items[ normalizedPath ]

        // File found
        if(typeof file !== 'undefined')
        {
            return file
        }

        // Force creation
        if(forceCreation)
        {
            file = this.create(normalizedPath)
            return file
        }

        // Not found
        return false
    }

    delete(_path)
    {
        // Set up
        const normalizedPath = paths.normalize(_path)

        // Retrieve file
        const file = this.get(normalizedPath)

        // File found
        if(file)
        {
            // Delete file
            file.destructor()
            delete this.items[ normalizedPath ]
            this.count--

            // Save
            this.lastVersionDate = new Date()

            // Emit
            this.projectSocket.emit('delete_file', file.describe())

            return true
        }

        return false
    }

    describe()
    {
        // Set up
        const result = {}

        result.count = this.count
        result.items = []

        // Each file
        for(const _filePath in this.items)
        {
            const file = this.items[_filePath]

            result.items.push(file.describe())
        }

        return result
    }

    destructor()
    {

    }
}

module.exports = Files

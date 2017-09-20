class FileTree
{
    /**
     * Create tree and add ./ folder
     * @param {Object} _options
     * @param {Boolean} _options.auto_wash - Should clean empty folder on removes
     */
    constructor(_options = {})
    {
        // Options
        this.autoWash = typeof _options.autoWash === 'undefined' ? false : _options.autoWash
        this.filesCount = 0
        this.foldersCount = 0
        this.allCount = 0

        // Set up
        this.folders = []
        this.addFolder('.', {})
    }

    /**
     * Clean path
     * @param {String} _path - Path to clean
     * @return {String} Cleaned path
     */
    cleanPath(_path = '')
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('cleanPath: _path should be a string')
            return false
        }

        let path = _path

        // Trim
        path = path.trim()

        // Repeating `/`
        path = path.replace(/\/+/g, '/')

        // Ending `/`
        path = path.replace(/\/$/, '')

        // Starting `/`
        path = path.replace(/^\//, '')

        // Missing starting `./`
        if(path !== '.' && path.search('./') !== 0)
        {
            path = './' + path
        }

        return path
    }

    /**
     * Add a folder
     * Can create nested folder in one path
     * @param {String} _path - Path to the folder (start with `./`)
     * @param {Object} _data - Properties to add to the folder
     * @returns {Object} Created folder
     */
    addFolder(_path = '', _data = {})
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('addFolder: _path should be a string')
            return false
        }
        if(typeof _data !== 'object')
        {
            console.warn('addFolder: _data should be an object')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')

        let folders = this.folders
        let folder = null

        // Each path part
        for(const _part of pathParts)
        {
            const index = folders.findIndex((folder) => _part === folder.name)

            // Already exist
            if(index !== -1)
            {
                folder = folders[index]
                folders = folder.folders
            }

            // Folder doesn't exist
            else
            {
                // Create folder
                folder = {
                    folders: [],
                    files: [],
                    name: _part
                }

                // Add data
                for(const dataKey in _data)
                {
                    const data = _data[dataKey]
                    folder[dataKey] = data
                }

                // Save
                folders.push(folder)
                folders = folder.folders
            }
        }

        // Update counts
        this.updateCounts()

        // Return
        return folder
    }

    /**
     * Add a file
     * Will create folders if needed
     * @param {String} _path - Path to the folder (start with `./`)
     * @param {Object} _data - Properties to add to the file
     * @returns {Object} Created file
     */
    addFile(_path = '', _data = {})
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('addFile: _path should be a string')
            return false
        }
        if(typeof _data !== 'object')
        {
            console.warn('addFile: _data should be an object')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')
        const filePart = pathParts.pop()

        // Create folder
        const folder = this.addFolder(pathParts.join('/'))

        // Create file
        const file = {
            name: filePart
        }

        // Add data
        for(const dataKey in _data)
        {
            const data = _data[dataKey]
            file[dataKey] = data
        }

        // Save
        folder.files.push(file)

        // Update counts
        this.updateCounts()

        return file
    }

    /**
     * Remove folder
     * Will delete contained folders and contained files
     * @param {String} _path - Folder to delete (start with `./`)
     * @returns {Boolean} Folder deleted or not
     */
    removeFolder(_path = '')
    {
        // Recursive emptying
        const emptyFolder = function(folder)
        {
            // Delete folders
            for(const _folderKey in folder.folders)
            {
                const _folder = folder.folders[_folderKey]

                emptyFolder(_folder)

                folder.folders.splice(_folderKey, 1)

                // Callback
                if(typeof _folder.onRemove === 'function')
                {
                    _folder.onRemove.apply(this, [_folder])
                }
            }

            // Delete files
            for(const _fileKey in folder.files)
            {
                const _file = folder.files[_fileKey]

                folder.files.splice(_fileKey, 1)

                // Callback
                if(typeof _file.onRemove === 'function')
                {
                    _file.onRemove.apply(this, [_file])
                }
            }
        }

        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('removeFolder: _path should be a string')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')
        const folderPart = pathParts.pop()

        let folders = this.folders
        let folder = null

        // Each path part
        for(const _part of pathParts)
        {
            const index = folders.findIndex((folder) => _part === folder.name)

            // Found
            if(index !== -1)
            {
                folder = folders[index]
                folders = folder.folders
            }

            // Not found
            else
            {
                folder = null
                folders = null
                break
            }
        }

        // Found
        const index = folders.findIndex((folder) => folderPart === folder.name)
        if(folders && index !== -1)
        {
            const folder = folders[index]

            // Delete
            emptyFolder(folder)
            folders.splice(index, 1)

            // Callback
            if(typeof folder.onRemove === 'function')
            {
                folder.onRemove.apply(this, [folder])
            }

            // Auto wash
            if(this.autoWash)
            {
                this.removeEmptyFolders()
            }

            // Update counts
            this.updateCounts()

            return true
        }

        return false
    }

    /**
     * Remove file
     * Will delete contained folders and contained files
     * @param {String} _path - File to delete (start with `./`)
     * @returns {Boolean} File deleted or not
     */
    removeFile(_path = '')
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('removeFile: _path should be a string')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')
        const filePart = pathParts.pop()

        let folders = this.folders
        let folder = null

        // Each path part
        for(const _part of pathParts)
        {
            const index = folders.findIndex((folder) => _part === folder.name)

            // Found
            if(index !== -1)
            {
                folder = folders[index]
                folders = folder.folders
            }

            // Not found
            else
            {
                folder = null
                folders = null
                break
            }
        }

        // Folder found
        if(folders && folder)
        {
            const index = folder.files.findIndex((file) => filePart === file.name)

            // File found
            if(index !== -1)
            {
                const file = folder.files[index]

                // Delete
                folder.files.splice(index, 1)

                // Auto wash
                if(this.autoWash)
                {
                    this.removeEmptyFolders()
                }

                // Callback
                if(typeof file.onRemove === 'function')
                {
                    file.onRemove.apply(this, [file])
                }

                // Update counts
                this.updateCounts()

                return true
            }
        }

        return false
    }

    /**
     * Get file
     * @param {String} _path - Path to file
     * @returns {Object} File
     */
    getFile(_path = '')
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('getFile: _path should be a string')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')
        const filePart = pathParts.pop()

        let folders = this.folders
        let folder = null

        // Each path part
        for(const _part of pathParts)
        {
            const index = folders.findIndex((folder) => _part === folder.name)

            // Found
            if(index !== -1)
            {
                folder = folders[index]
                folders = folder.folders
            }

            // Not found
            else
            {
                folder = null
                folders = null
                break
            }
        }

        // Folder found
        if(folders && folder)
        {
            const index = folder.files.findIndex((file) => filePart === file.name)

            if(index !== -1)
            {
                const file = folder.files[index]
                return file
            }
        }

        return false
    }

    /**
     * Get folder
     * @param {String} _path - Path to folder
     * @returns {Object} Folder
     */
    getFolder(_path = '')
    {
        // Errors
        if(typeof _path !== 'string')
        {
            console.warn('getFolder: _path should be a string')
            return false
        }

        // Set up
        const path = this.cleanPath(_path)
        const pathParts = path.split('/')

        let folders = this.folders
        let folder = null

        // Each path part
        for(const _part of pathParts)
        {
            const index = folders.findIndex((folder) => _part === folder.name)

            // Found
            if(index !== -1)
            {
                folder = folders[index]
                folders = folder.folders
            }

            // Folder doesn't exist
            else
            {
                return false
            }
        }

        // Return
        return folder
    }

    /**
     * Browse every folders and remove empty ones
     * @return {Number} Number of removed folders
     */
    removeEmptyFolders()
    {
        // Set up
        let removedCount = 0

        // Recursive remove
        const canRemoveFolder = function(folder)
        {
            // Each folder inside current folder
            for(const _folderKey in folder.folders)
            {
                // Try to remove folder
                const _folder = folder.folders[_folderKey]
                const canRemove = canRemoveFolder(_folder)

                // Remove folder
                if(canRemove)
                {
                    removedCount++

                    // Delete
                    folder.folders.splice(_folderKey, 1)

                    // Callback
                    if(typeof _folder.onRemove === 'function')
                    {
                        _folder.onRemove.apply(this, [_folder])
                    }
                }
            }

            // Can be removed
            const folderKeys = Object.keys(folder.folders)
            const filesKeys = Object.keys(folder.files)

            if(folderKeys.length === 0 && filesKeys.length === 0)
            {
                return true
            }
            else
            {
                return false
            }
        }

        // Try from ./
        canRemoveFolder(this.folders[0])

        // Update counts
        this.updateCounts()

        return removedCount
    }

    /**
     * Update counts
     */
    updateCounts()
    {
        let filesCount = 0
        let foldersCount = 0

        // Recursive emptying
        const traverseFolder = function(folder)
        {
            // Each folder
            for(const _folderKey in folder.folders)
            {
                const _folder = folder.folders[_folderKey]

                traverseFolder(_folder)

                foldersCount++
            }

            // Each file
            for(const _fileKey in folder.files)
            {
                filesCount++
            }
        }

        traverseFolder(this.folders[0])

        this.filesCount = filesCount
        this.foldersCount = foldersCount
        this.allCount = this.filesCount + this.foldersCount
    }

    /**
     * Describe the tree in ASCII (├ ─ │ └)
     * @param {Boolean} _log - Directly log to console
     * @param {Boolean} _colored - Colored tree (only work well in Chrome)
     * @return {String} Tree
     */
    describe(_log = false, _colored = false)
    {
        // Set up
        const depth = 0
        const styles = []

        let stringTree = ''

        const addToString = function(value = '', type = null)
        {
            if(_colored)
            {
                stringTree += '%c'

                switch(type)
                {
                case 'structure':
                    styles.push('color:#999;')
                    break

                case 'folder':
                    styles.push('color:#999;')
                    break
                case 'file':
                    styles.push('color:#333;font-weight:bold;')
                    break

                default:
                    styles.push('')
                    break
                }
            }

            stringTree += value
        }

        // Recursive describe
        const describeFolder = function(folder, depth, last = [])
        {
            // Each folders
            for(let i = 0; i < folder.folders.length; i++)
            {
                // Set up
                const _folder = folder.folders[i]

                // Add to tree string
                addToString('\n')

                for(let j = 0; j < depth; j++)
                {
                    if(j === depth - 1)
                    {
                        if(i === folder.folders.length - 1 && folder.files.length === 0)
                        {
                            addToString(' └', 'structure')
                        }
                        else
                        {
                            addToString(' ├', 'structure')
                        }
                    }
                    else
                    {
                        if(last[j])
                        {
                            addToString('  ', 'structure')
                        }
                        else
                        {
                            addToString(' │', 'structure')
                        }
                    }
                }

                addToString('─', 'structure')
                addToString(_folder.name, 'folder')
                addToString('/', 'structure')

                // Last
                last.push(i === folder.folders.length - 1 && folder.files.length === 0)

                // Continue
                describeFolder(_folder, depth + 1, last)
            }

            // Each files
            for(let i = 0; i < folder.files.length; i++)
            {
                // Set up
                const _file = folder.files[i]

                // Add to tree string
                stringTree += '\n'

                for(let j = 0; j < depth; j++)
                {
                    if(j === depth - 1)
                    {
                        if(i === folder.files.length - 1)
                        {
                            addToString(' └', 'structure')
                        }
                        else
                        {
                            addToString(' ├', 'structure')
                        }
                    }
                    else
                    {
                        if(last[j])
                        {
                            addToString('  ', 'structure')
                        }
                        else
                        {
                            addToString(' │', 'structure')
                        }
                    }
                }

                addToString('─', 'structure')
                addToString(_file.name, 'file')
            }
        }

        // Describe from ./
        addToString('.', 'folder')
        addToString('/', 'structure')
        describeFolder(this.folders[0], depth + 1)

        // Log
        if(_log)
        {
            console.log(...[stringTree].concat(styles))
        }

        return stringTree
    }
}


// /**
//  * Tests
//  */
// const filesTree = new FileTree()

// filesTree.addFolder('./hey/hoy', { active: false, notifs: 0 })
// filesTree.addFolder('./hey/hoy/toto', { active: false, notifs: 0 })
// filesTree.addFolder('./hey/hoy/tata', { active: false, notifs: 0 })

// filesTree.addFile('./test-1.txt', { active: false, notifs: 0 })
// filesTree.addFile('./hey/hoy/test-2.txt', { active: false, notifs: 0 })
// filesTree.addFile('./hey/hoy/test-3.txt', { active: false, notifs: 0 })
// filesTree.addFile('./hey/hoy/tata/test-4.txt', { active: false, notifs: 0 })
// filesTree.addFile('./hey/hoy/toto/test-5.txt', { active: false, notifs: 0 })

// filesTree.addFile('./hey/hoy/toto/test-6.txt', {
//     active: false,
//     notifs: 0,
//     onRemove: (file) =>
//     {
//         console.log('removed file :', file)
//     }
// })
// filesTree.removeFile('./hey/hoy/toto/test-6.txt')

// filesTree.addFolder('./pwet', {
//     onRemove: (folder) =>
//     {
//         console.log('removed folder :', folder)
//     }
// })
// filesTree.addFolder('./pwet/uh', {
//     onRemove: (folder) =>
//     {
//         console.log('removed folder :', folder)
//     }
// })
// filesTree.removeFolder('./pwet')

// filesTree.removeFile('./hey/hoy/test-2.txt')
// filesTree.removeFolder('./hey')

// filesTree.describe(true, true)

export default FileTree
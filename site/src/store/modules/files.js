import FileTree from '@/utils/FileTree'

export default {
    state:
    {
        tree: new FileTree({ autoWash: true }),
        currentFile: null,
        currentVersion: null,
        currentLine: null,
        search: ''
    },

    mutations:
    {
        updateFiles(state, data)
        {
            state.tree = new FileTree({ autoWash: true })

            for(const file of data)
            {
                file.isNew = false
                file.isChanged = false
                state.tree.addFile(file.path.full, file)
            }
        },

        createFile(state, data)
        {
            data.isNew = true
            data.isChanged = false
            data.isActive = false
            state.tree.addFile(data.path.full, data)
        },

        deleteFile(state, data)
        {
            state.tree.removeFile(data.path.full)
        },

        setFile(state, data)
        {
            // Null file
            if(!data)
            {
                if(state.currentFile)
                {
                    state.currentFile.isActive = false
                }

                state.currentFile = null
            }

            // File path
            else
            {
                // Retrieve file from path
                const file = state.tree.getFile(data)

                // No current file or file different than current
                if(!state.currentFile || state.currentFile.id !== file.id)
                {
                    if(state.currentFile)
                    {
                        state.currentFile.isActive = false
                    }

                    state.currentFile = file
                    state.currentFile.isActive = true
                    state.currentFile.isNew = false
                    state.currentFile.isChanged = false
                }
            }
        },

        createVersion(state, data)
        {
            const file = state.tree.getFile(data.file)

            if(file)
            {
                file.versions.push(data.version)
                file.isChanged = true
            }
        },

        setVersion(state, data)
        {
            // Date sent
            if(typeof data === 'string')
            {
                // Find version by date
                const version = state.currentFile.versions.find((version) => version.date === data)

                // Found
                if(version)
                {
                    state.currentVersion = version
                }
            }

            // Version directly sent
            else
            {
                state.currentVersion = data
            }
        },

        setLine(state, data)
        {
            state.currentLine = data
        },

        searchFile(state, data)
        {
            state.search = data
        }
    }
}
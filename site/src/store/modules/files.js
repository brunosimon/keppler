import FileTree from '@/utils/FileTree'

export default {
    state:
    {
        tree: new FileTree({ autoWash: true }),
        current: null,
        currentVersion: null
    },

    mutations:
    {
        updateFiles(state, data)
        {
            state.tree = new FileTree({ autoWash: true })

            for(const file of data)
            {
                state.tree.addFile(file.path.full, file)
            }
        },

        createFile(state, data)
        {
            state.tree.addFile(data.path.full, data)
        },

        deleteFile(state, data)
        {
            state.tree.removeFile(data.path.full)
        },

        setFile(state, data)
        {
            const file = state.tree.getFile(data)

            if(file)
            {
                state.current = file
            }
        },

        createVersion(state, data)
        {
            const file = state.tree.getFile(data.file)

            if(file)
            {
                file.data.versions.push(data.version)
            }
        },

        setVersion(state, data)
        {
            state.currentVersion = data
        }
    }
}
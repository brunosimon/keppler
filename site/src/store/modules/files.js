import FileTree from '@/utils/FileTree'

export default {
    state:
    {
        tree: new FileTree({ autoWash: true }),
        current: null,
        currentVersion: null,
        search: ''
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

            if(!state.current || state.current.data.id !== file.data.id)
            {
                state.current = file
                // console.log(state.current.data.versions.length)
                // state.currentVersion = state.current.data.versions[state.current.data.versions.length - 1]
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
        },

        searchFile(state, data)
        {
            state.search = data
        }
    }
}
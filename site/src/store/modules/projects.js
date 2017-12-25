export default {
    state:
    {
        all: {},
        current: null
    },

    mutations:
    {
        updateProjects(state, data)
        {
            state.all = data

            // Has a current project
            if(state.current)
            {
                // Current project has been removed
                if(typeof state.all[state.current.slug] === 'undefined')
                {
                    const projectKeys = Object.keys(state.all)
                    state.current = state.all[projectKeys[0]]
                }
            }

            // No current project
            else
            {
                // Set first project as current
                const projectKeys = Object.keys(state.all)
                state.current = state.all[projectKeys[0]]
            }
        },

        addProject(state, data)
        {
            state.all.push(data)
        },

        setProject(state, data)
        {
            // Test of project exist
            if(typeof state.all[data] !== 'undefined')
            {
                state.current = state.all[data]
            }
        }
    }
}
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
                if(typeof state.all[data] === 'undefined')
                {
                    state.current = null
                }
            }

            // No current project
            else
            {
                const projectKeys = Object.keys(state.all)

                // If only one project, set has current
                if(projectKeys.length === 1)
                {
                    state.current = state.all[projectKeys[0]]
                }
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
        },
    }
}
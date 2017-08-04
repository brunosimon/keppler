import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:
    {
        projects: {},
        currentProject: null
    },

    mutations:
    {
        updateProjects(state, data)
        {
            state.projects = data

            // Has a current project
            if(state.currentProject)
            {
                // Current project has been removed
                if(typeof state.projects[data] === 'undefined')
                {
                    state.currentProject = null
                }
            }

            // No current project
            else
            {
                const projectKeys = Object.keys(state.projects)

                // If only one project, set has current
                if(projectKeys.length === 1)
                {
                    state.currentProject = state.projects[projectKeys[0]]
                }
            }
        },

        addProject(state, data)
        {
            state.projects.push(data)
        },

        setCurrentProject(state, data)
        {
            // Test of project exist
            if(typeof state.projects[data] !== 'undefined')
            {
                state.currentProject = state.projects[data]
            }
        }
    }
})
import Vue from 'vue'
import Vuex from 'vuex'
import FileTree from '@/utils/FileTree'

Vue.use(Vuex)

export default new Vuex.Store({
    state:
    {
        projects: {},
        project: null,
        files: new FileTree({ autoWash: true }),
        file: null
    },

    mutations:
    {
        /**
         * Projects
         */
        updateProjects(state, data)
        {
            state.projects = data

            // Has a current project
            if(state.project)
            {
                // Current project has been removed
                if(typeof state.projects[data] === 'undefined')
                {
                    state.project = null
                }
            }

            // No current project
            else
            {
                const projectKeys = Object.keys(state.projects)

                // If only one project, set has current
                if(projectKeys.length === 1)
                {
                    state.project = state.projects[projectKeys[0]]
                }
            }
        },

        addProject(state, data)
        {
            state.projects.push(data)
        },

        setProject(state, data)
        {
            // Test of project exist
            if(typeof state.projects[data] !== 'undefined')
            {
                state.project = state.projects[data]
            }
        },

        /**
         * Files
         */
        updateFiles(state, data)
        {
            state.files = new FileTree({ autoWash: true })

            for(const file of data)
            {
                state.files.addFile(file.path.full, file)
            }
        },

        createFile(state, data)
        {
            state.files.addFile(data.path.full, data)
        },

        deleteFile(state, data)
        {
            state.files.removeFile(data.path.full)
        }
    }
})
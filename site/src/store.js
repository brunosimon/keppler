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
        file: null,
        version: null,
        chatMessages: [],
        user: null,
        pendingUser: null
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
        },

        setFile(state, data)
        {
            const file = state.files.getFile(data)

            if(file)
            {
                state.file = file
            }
        },

        createVersion(state, data)
        {
            const file = state.files.getFile(data.file)

            if(file)
            {
                file.data.versions.push(data.version)
            }
        },

        setVersion(state, data)
        {
            state.version = data
        },

        /**
         * Messages
         */
        createMessage(state, data)
        {
            state.chatMessages.push(data)

            if(state.chatMessages.length > 100)
            {
                state.chatMessages.splice(0, state.chatMessages.length - 100)
            }
        },

        /**
         * User
         */
        updateUser(state, data)
        {
            state.user = data
        },

        askUpdateUser(state, data)
        {
            state.pendingUser = data
        }
    }
})
import Vue from 'vue'
import Vuex from 'vuex'

import chatModule from './modules/chat'
import projectsModule from './modules/projects'
import filesModule from './modules/files'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:
    {
        chat: chatModule,
        projects: projectsModule,
        files: filesModule
    },

    state:
    {
        serverConfig: null,
        scrollbarWidth: 0
    },

    mutations:
    {
        updateServerConfig(state, data)
        {
            state.serverConfig = data
        },

        updateScrollbarWidth(state, data)
        {
            state.scrollbarWidth = data
        }
    }
})
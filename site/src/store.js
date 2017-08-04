import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:
    {
        projects: [],
        currentProject: null
    },

    mutations:
    {
        updateProjects(state, data)
        {
            for(const key in data)
            {
                const project = data[key]
                state.projects.push(project)
            }
        },

        addProject(state, data)
        {
            state.projects.push(data)
        },

        removeProject(state, data)
        {
            console.log(data)
        }
    }
})
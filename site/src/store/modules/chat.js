export default {
    state:
    {
        user: null,
        pendingUser: null,
        messages: [],
        pendingMessage: null
    },

    mutations:
    {
        createMessage(state, data)
        {
            state.messages.push(data)

            if(state.messages.length > 100)
            {
                state.messages.splice(0, state.messages.length - 100)
            }
        },

        updateUser(state, data)
        {
            state.user = data
        },

        askUpdateUser(state, data)
        {
            state.pendingUser = data
        }
    }
}
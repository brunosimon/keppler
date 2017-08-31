export default {
    state:
    {
        open: false,
        user: null,
        pendingUser: null,
        messages: [],
        pendingMessage: null,
        pendingAlert: null,
        question: null
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

        setPendingUser(state, data)
        {
            state.pendingUser = data
        },

        setPendingMessage(state, data)
        {
            state.pendingMessage = data
        },

        setPendingAlert(state)
        {
            const date = new Date()
            state.pendingAlert = { date }
        },

        setQuestion(state, data)
        {
            state.question = data
        },

        openChat(state)
        {
            state.open = true
        },

        closeChat(state)
        {
            state.open = false
        },

        toggleChat(state)
        {
            state.open = !state.open
        }
    }
}
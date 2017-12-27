import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'

Vue.use(VueHighlightJS)

export default
{
    name: 'viewer',

    props:
    {
        differencesActive: { type: Boolean, default: true }
    },

    computed:
    {
        extension()
        {
            return this.$store.state.files.currentFile.extension
        },

        version()
        {
            return this.$store.state.files.currentVersion
        },

        linesCount()
        {
            return (this.version.content.match(/\n/g) || []).length + 1
        },

        currentLine()
        {
            return this.$store.state.files.currentLine
        },

        scrollbarWidth()
        {
            return this.$store.state.scrollbarWidth
        }
    },

    methods:
    {
        onCodeKeyDown(event)
        {
            // Not arrow keys
            if(
                event.keyCode !== 38 &&
                event.keyCode !== 39 &&
                event.keyCode !== 40 &&
                event.keyCode !== 37
            )
            {
                // Not meta keys
                if(!event.metaKey && !event.ctrlKey)
                {
                    event.preventDefault()
                }

                // Meta keys
                else
                {
                    // Cut (meta + x) or past (meta + v) keys
                    if(event.keyCode === 88 || event.keyCode === 86)
                    {
                        event.preventDefault()
                    }
                }
            }
        },

        onLineClick(index)
        {
            const question = {}
            question.line = index
            question.version = this.version.date
            question.file = this.$store.state.files.currentFile.path.full
            this.$store.commit('setQuestion', question)
            this.$store.commit('openChat')
        }
    }
}
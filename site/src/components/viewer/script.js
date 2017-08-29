import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'

Vue.use(VueHighlightJS)

export default
{
    name: 'viewer',

    components:
    {
    },

    computed:
    {
        extension()
        {
            return this.$store.state.files.current.extension
        },

        version()
        {
            return this.$store.state.files.currentVersion
        },

        linesCount()
        {
            return (this.$store.state.files.currentVersion.content.match(/\n/g) || []).length + 1
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
                event.keyCode !== 30 &&
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
        }
    }
}
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
        version()
        {
            return this.$store.state.files.currentVersion
        }
    },

    methods:
    {
        onCodeKeyDown(event)
        {
            if(!event.metaKey && !event.ctrlKey)
            {
                event.preventDefault()
            }
            else
            {
                if(event.keyCode === 88 || event.keyCode === 86)
                {
                    event.preventDefault()
                }
            }
        }
    }
}
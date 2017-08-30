import Versions from '@/components/versions'
import Viewer from '@/components/viewer'

export default
{
    name: 'file',

    components:
    {
        Versions,
        Viewer
    },

    computed:
    {
        project()
        {
            return this.$store.state.projects.current
        }
    },

    data()
    {
        return {
            differencesActive: true,
            versionsActive: true
        }
    },

    props:
    {
        content: { type: Object }
    },

    methods:
    {
        onDifferencesClick()
        {
            this.differencesActive = !this.differencesActive
        },

        onVersionsClick()
        {
            this.versionsActive = !this.versionsActive
        }
    }
}
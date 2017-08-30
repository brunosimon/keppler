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
        downloadUrl()
        {
            return `${this.$store.state.url}/${this.$store.state.projects.current.slug}/files/${this.content.path.full}`
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
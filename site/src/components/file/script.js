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
        },

        isImage()
        {
            return ['jpg', 'jpeg', 'png', 'tiff', 'gif', 'webp'].indexOf(this.content.extension) !== -1
        },

        isCode()
        {
            return this.content.versions.length > 0
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
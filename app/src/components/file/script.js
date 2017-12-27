import Versions from '@/components/versions'
import Viewer from '@/components/viewer'
import Tooltip from '@/components/tooltip'
import Illustration from '@/components/illustration'
import copyToClipboard from 'copy-to-clipboard'

export default
{
    name: 'file',

    components:
    {
        Versions,
        Viewer,
        Tooltip,
        Illustration
    },

    computed:
    {
        serverConfig()
        {
            return this.$store.state.serverConfig
        },

        downloadUrl()
        {
            return `${this.$store.state.serverConfig.domain}/${this.$store.state.projects.current.slug}/files/${this.content.path.full}`
        },

        downloadDataUri()
        {
            if(this.$store.state.files.currentVersion)
            {
                return `data:text/plain;charset=utf-8,${encodeURIComponent(this.$store.state.files.currentVersion.content)}`
            }

            return ''
        },

        isImage()
        {
            return ['jpg', 'jpeg', 'png', 'tiff', 'gif', 'webp'].indexOf(this.content.extension) !== -1
        },

        isCode()
        {
            return this.content.versions.length > 0
        },

        version()
        {
            return this.$store.state.files.currentVersion
        }
    },

    data()
    {
        return {
            differencesActive: true,
            versionsActive: true,
            copied: false
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
        },

        onCopyClick()
        {
            copyToClipboard(this.version.content)
            this.copied = true
        },

        onCopyMouseleave()
        {
            this.copied = false
        }
    }
}
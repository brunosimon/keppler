import FilesTree from '@/components/files-tree'
import File from '@/components/file'
import Landing from '@/components/landing'
import Chat from '@/components/chat'
import Alert from '@/components/alert'

export default
{
    name: 'project',

    components:
    {
        FilesTree,
        File,
        Landing,
        Chat,
        Alert
    },

    computed:
    {
        downloadUrl()
        {
            return `${this.$store.state.serverConfig.domain}/${this.project.slug}/download`
        },

        project()
        {
            return this.$store.state.projects.current
        },

        file()
        {
            return this.$store.state.files.currentFile
        }
    },

    created()
    {
    },

    methods:
    {
    }
}
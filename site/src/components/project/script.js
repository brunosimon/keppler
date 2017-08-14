import FilesTree from '@/components/files-tree'
import File from '@/components/file'
import Chat from '@/components/chat'

export default
{
    name: 'project',

    components:
    {
        FilesTree,
        File,
        Chat
    },

    computed:
    {
        project()
        {
            return this.$store.state.projects.current
        },

        file()
        {
            return this.$store.state.files.current
        }
    },

    created()
    {
    },

    methods:
    {
    }
}
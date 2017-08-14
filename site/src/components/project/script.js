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
            return this.$store.state.project
        },
        file()
        {
            return this.$store.state.file
        }
    },

    created()
    {
    },

    methods:
    {
    }
}
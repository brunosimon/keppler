import FilesTreeFile from '@/components/files-tree-file'
import FileIcon from '@/components/file-icon/'

export default
{
    name: 'files-tree-folder',

    components:
    {
        FilesTreeFile,
        FileIcon
    },

    props:
    {
        depth: { type: Number, default: 0 },
        content: { type: Object }
    },

    data()
    {
        return {
            open: true
        }
    },

    computed:
    {
        files()
        {
            const files = this.content.files.sort((fileA, fileB) => fileA.name < fileB.name ? -1 : 1)

            return files
        }
    },

    created()
    {
    },

    methods:
    {
        onNameClick()
        {
            this.open = !this.open
        }
    }
}
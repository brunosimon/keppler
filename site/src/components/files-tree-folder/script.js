import FilesTreeFile from '@/components/files-tree-file'

export default
{
    name: 'files-tree-folder',

    components:
    {
        FilesTreeFile
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
            const files = this.content.files.sort((fileA, fileB) =>
            {
                return fileA.name < fileB.name ? -1 : 1
            })

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
import FilesTreeFile from '@/components/files-tree-file'
import FilesTreeFolder from '@/components/files-tree-folder'
import FileTree from '@/utils/FileTree'

// const fileTree = new FileTree({ autoWash: true })
// fileTree.addFolder('./toto', { hey: 'hoy' })
// fileTree.addFolder('./toto/uhuh', { hey: 'a' })
// fileTree.addFolder('./lorem')
// fileTree.addFile('./test-1.txt')
// fileTree.addFile('./test-2.txt')

// window.setInterval(() =>
// {
//     fileTree.addFile('./toto/uhuh/' + new Date())
//     fileTree.removeFolder('./lorem')
//     fileTree.removeFile('./test-1.txt')
// }, 1000)

export default
{
    name: 'files-tree',

    components:
    {
        FilesTreeFile,
        FilesTreeFolder
    },

    data()
    {
        return {}
    },

    computed:
    {
        files()
        {
            return this.$store.state.files
        }
    },

    watch:
    {
        files: 'onFilesChange'
    },

    created()
    {
    },

    methods:
    {
        onFilesChange(newValue, oldValue)
        {
            console.log('onFilesChange')
            console.log(newValue)
            console.log(oldValue)
        }
    }
}
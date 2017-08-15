import FileIcon from '@/components/file-icon/'

export default
{
    name: 'files-tree-file',

    components:
    {
        FileIcon
    },

    props:
    {
        depth: { type: Number, default: 0 },
        content: { type: Object }
    },

    methods:
    {
        onNameClick()
        {
            this.$store.commit('setFile', this.content.data.path.full)
        }
    }
}
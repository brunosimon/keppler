export default
{
    name: 'files-tree-file',

    props:
    {
        depth: { type: Number, default: 0 },
        content: { type: Object }
    },

    created()
    {
    },

    methods:
    {
        onNameClick()
        {
            this.$store.commit('setFile', this.content.data.path.full)
        }
    }
}
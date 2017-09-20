import Version from '@/components/version'

export default
{
    name: 'versions',

    components:
    {
        Version
    },

    props:
    {
        content: { type: Array },
        file: { type: Object }
    },

    computed:
    {
        versions()
        {
            // console.log('uh')
            const versions = this.content.sort((versionA, versionB) =>
            {
                const dateA = new Date(versionA.date)
                const dateB = new Date(versionB.date)

                return dateB.getTime() - dateA.getTime()
            })

            return versions
        },

        scrollbarWidth()
        {
            return this.$store.state.scrollbarWidth
        }
    },

    watch:
    {
        versions: 'onVersionsUpdate',
        file: 'onFileUpdate'
    },

    created()
    {
        this.keepLatest = true
    },

    mounted()
    {
        this.$store.commit('setVersion', this.versions[0])
    },

    methods:
    {
        onVersionsUpdate()
        {
            if(this.keepLatest)
            {
                this.file.isChanged = false
                this.$store.commit('setVersion', this.versions[0])
            }
        },

        onFileUpdate()
        {
            this.keepLatest = true
            this.$store.commit('setVersion', this.versions[0])
        },

        onVersionClick(version, index)
        {
            this.keepLatest = index === 0
            this.file.isChanged = false

            this.$store.commit('setVersion', version)
            this.$store.commit('setLine', null)
        }
    }
}
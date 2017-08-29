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
        }
    },

    watch:
    {
        versions: 'onVersionsUpdate',
        file: 'onFileUpdate'
    },

    created()
    {
        this.keepLatest = false
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

            this.$store.commit('setVersion', version)
        }
    }
}
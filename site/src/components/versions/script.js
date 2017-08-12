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
        content: { type: Array }
    },

    computed:
    {
        versions()
        {
            const versions = this.content.sort((versionA, versionB) =>
            {
                const dateA = new Date(versionA.date)
                const dateB = new Date(versionB.date)

                return dateB.getTime() - dateA.getTime()
            })

            return versions
        }
    }
}
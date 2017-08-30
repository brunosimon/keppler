import Versions from '@/components/versions'
import Viewer from '@/components/viewer'

export default
{
    name: 'file',

    components:
    {
        Versions,
        Viewer
    },

    data()
    {
        return {
            differencesActive: true
        }
    },

    props:
    {
        content: { type: Object }
    },

    methods:
    {
        onDifferencesClick()
        {
            this.differencesActive = !this.differencesActive
        }
    }
}
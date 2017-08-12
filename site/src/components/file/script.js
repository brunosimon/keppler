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

    props:
    {
        content: { type: Object }
    }
}
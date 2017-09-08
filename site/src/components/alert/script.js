import Tooltip from '@/components/tooltip'

export default
{
    name: 'alert',

    components:
    {
        Tooltip
    },

    methods:
    {
        onAlertClick()
        {
            this.$store.commit('setPendingAlert')
        }
    }
}
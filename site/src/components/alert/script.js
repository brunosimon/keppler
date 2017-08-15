export default
{
    name: 'alert',

    methods:
    {
        onAlertClick()
        {
            this.$store.commit('setPendingAlert')
        }
    }
}
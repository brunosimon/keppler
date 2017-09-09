const packageJson = require('../../../../package.json')

export default
{
    name: 'popin',

    data()
    {
        return {
            active: false,
            version: packageJson.version
        }
    },

    methods:
    {
        onTriggerClick()
        {
            this.open()
        },

        onMaskClick()
        {
            this.close()
        },

        onCloseClick()
        {
            this.close()
        },

        open()
        {
            this.active = true
        },

        close()
        {
            this.active = false
        }
    }
}
import quotes from './quotes'
import Fireworks from '@/components/fireworks'
import Illustration from '@/components/illustration'

export default
{
    name: 'landing',

    components:
    {
        Fireworks,
        Illustration
    },

    data()
    {
        return {
            focus: false,
            fireworksRunning: false
        }
    },

    watch:
    {
        focus: 'onFocusChange'
    },

    computed:
    {
        quote: () => quotes[Math.floor(quotes.length * Math.random())],
        url()
        {
            return this.$store.state.serverConfig.domain
        }
    },

    methods:
    {
        onFocusChange(value)
        {
            // Enter focus
            if(value)
            {
                // Wait few seconds
                window.setTimeout(() =>
                {
                    // Still focusing
                    if(this.focus)
                    {
                        this.fireworksRunning = true
                    }
                }, 3000)
            }

            // Leave focus
            else
            {
                this.fireworksRunning = false
            }
        },

        onUrlClick()
        {
            this.focus = !this.focus
        },

        onLandingClick()
        {
            this.focus = false
        }
    }
}
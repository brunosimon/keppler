import quotes from './quotes'
import Fireworks from '@/components/fireworks'

export default
{
    name: 'landing',

    components:
    {
        Fireworks
    },

    data()
    {
        return {
            focus: false,
            fireworksRunning: false,
            stars: []
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
            return this.$store.state.url
        }
    },

    created()
    {
        for(let i = 0; i < 20; i++)
        {
            this.stars.push([
                Math.round(Math.random() * 200 - 50) + '%',
                Math.round(Math.random() * 200 - 50) + '%',
                Math.random() * 4 + 's'
            ])
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
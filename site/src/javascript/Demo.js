import speaker from '../assets/videos/speaker.mp4'
import audience from '../assets/videos/audience.mp4'

export default class Demo
{
    constructor()
    {
        this.step = 0
        this.$container = document.querySelector('.js-demo')

        // Speaker
        this.$speaker = this.$container.querySelector('.js-speaker')

        this.$speakerVideo = document.createElement('video')
        this.$speakerVideo.playsinline = true
        this.$speakerVideo.webkitPlaysinline = true
        this.$speakerVideo.muted = true
        this.$speakerVideo.src = speaker
        this.$speakerVideo.height = 300

        this.$speaker.appendChild(this.$speakerVideo)

        this.speakerCurrentTime = 0

        // Audience
        this.$audience = this.$container.querySelector('.js-audience')

        this.$audienceVideo = document.createElement('video')
        this.$audienceVideo.playsinline = true
        this.$audienceVideo.webkitPlaysinline = true
        this.$audienceVideo.muted = true
        this.$audienceVideo.src = audience
        this.$audienceVideo.height = 300

        this.$audience.appendChild(this.$audienceVideo)

        this.audienceCurrentTime = 0

        // Go step
        window.setTimeout(() =>
        {
            this.goStep(0)
        }, 1000)

        this.$audienceVideo.addEventListener('ended', () =>
        {
            window.setTimeout(() =>
            {
                this.goStep(6)
            }, 2000)
        })

        /**
         * Loop
         */
        this.setLoop()
    }

    /**
     * Set loop
     */
    setLoop()
    {
        const loop = () =>
        {
            window.requestAnimationFrame(loop)

            this.loop()
        }

        loop()
    }

    /**
     * Loop
     */
    loop()
    {
        if(this.speakerCurrentTime < 7 && this.$speakerVideo.currentTime >= 7)
        {
            this.goStep(2)
        }

        if(this.audienceCurrentTime < 0.85 && this.$audienceVideo.currentTime >= 0.85)
        {
            this.goStep(3)
        }

        if(this.speakerCurrentTime < 15.5 && this.$speakerVideo.currentTime >= 15.5)
        {
            this.goStep(4)
        }

        if(this.speakerCurrentTime < 17.25 && this.$speakerVideo.currentTime >= 17.25)
        {
            this.goStep(5)
        }

        this.speakerCurrentTime = this.$speakerVideo.currentTime
        this.audienceCurrentTime = this.$audienceVideo.currentTime
    }

    /**
     * Go to step
     */
    goStep(index)
    {
        // // Remove old step class
        // if(this.step !== null)
        // {
        //     this.$container.classList.remove(`step-${this.step}`)
        // }

        // Add new step class
        this.step = index
        this.$container.classList.add(`step-${this.step}`)

        // Cases
        switch(this.step)
        {
            case 0:
                this.$speakerVideo.currentTime = 0
                this.$speakerVideo.play()
                    .then(() =>
                    {
                        this.goStep(1)
                    })
                break

            case 1:
                break

            case 2:
                this.$audienceVideo.play()
                break

            case 6:
                window.setTimeout(() =>
                {
                    for(let step = 0; step < 7; step++)
                    {
                        this.$container.classList.remove(`step-${step}`)
                    }
                }, 800)

                window.setTimeout(() =>
                {
                    this.goStep(0)
                }, 1600)

                break
        }
    }
}
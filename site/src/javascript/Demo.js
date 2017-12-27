import speaker from '../assets/videos/speaker.mp4'
import audience from '../assets/videos/audience.mp4'

export default class Demo
{
    constructor()
    {
        this.$container = document.querySelector('.js-demo')

        // Speaker
        this.$speaker = this.$container.querySelector('.js-speaker')

        this.$speakerVideo = document.createElement('video')
        this.$speakerVideo.src = speaker
        this.$speakerVideo.height = 300
        this.$speakerVideo.autoplay = true

        this.$speaker.appendChild(this.$speakerVideo)

        // Audience
        this.$audience = this.$container.querySelector('.js-audience')

        this.$audienceVideo = document.createElement('video')
        this.$audienceVideo.src = audience
        this.$audienceVideo.height = 300
        this.$audienceVideo.autoplay = true

        this.$audience.appendChild(this.$audienceVideo)
    }
}
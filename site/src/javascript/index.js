import Demo from './Demo.js'
import Scroll from './Scroll.js'

export default class Site
{
    constructor()
    {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints
        document.documentElement.classList.add(this.isTouch ? 'touch' : 'no-touch')

        this.demo = new Demo()
        this.scroll = new Scroll()
    }
}
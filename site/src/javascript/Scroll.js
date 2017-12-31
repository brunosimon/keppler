export default class Scroll
{
    constructor()
    {
        this.parse()
    }

    /**
     * Search and set js-scroll-item elements
     * @param {Element} _$element Target element to parse
     */
    parse(_$element = null)
    {
        const $element = _$element || document
        const $items = $element.querySelectorAll('.js-scroll-item:not(.scroll-item-set)')

        for(const $item of $items)
        {
            this.setItem($item)
        }
    }

    setItem($item)
    {
        $item.addEventListener('click', (event) =>
        {
            event.preventDefault()

            const href = $item.getAttribute('href')
            const $element = document.querySelector(href)

            if($element)
            {
                this.scrollTo($element.offsetTop)
            }
        })
    }

    /**
     * Scroll to value with transition
     * @param {Number} scrollTargetY Scroll value
     * @param {Number} speed Speed
     */
    scrollTo(scrollTargetY = 0, speed = 2000)
    {
        // Set up
        const scrollY = window.scrollY || document.documentElement.scrollTop
        let currentTime = 0
        const time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8))

        // EaseInOutQuint
        const easeInOutQuint = (pos) =>
        {
            if ((pos /= 0.5) < 1) {
                return 0.5 * Math.pow(pos, 5);
            }
            return 0.5 * (Math.pow((pos - 2), 5) + 2);
        }

        // Tick
        const tick = () =>
        {
            currentTime += 1 / 60

            const p = currentTime / time
            const t = easeInOutQuint(p)

            if(p < 1)
            {
                window.requestAnimationFrame(tick)
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t))
            }
            else
            {
                window.scrollTo(0, scrollTargetY)
            }
        }

        tick()
    }
}
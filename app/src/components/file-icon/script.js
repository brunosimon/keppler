export default
{
    name: 'file-icon',

    props:
    {
        extension: { type: String, default: '' }
    },

    created()
    {
        this.icons = {
            js: ['js'],
            typescript: ['ts'],
            html: ['html', 'htm'],
            sass: ['sass', 'scss'],
            less: ['less'],
            stylus: ['stylus', 'styl'],
            css: ['css'],
            php: ['php'],
            json: ['json'],
            jade: ['jade'],
            pug: ['pug'],
            md: ['md'],
            sql: ['sql'],
            apache: ['htaccess', 'htpasswd'],
            yml: ['yml'],
            svg: ['svg'],
            font: ['eot', 'ttf', 'woff', 'woff2'],
            image: ['jpeg', 'jpg', 'tiff', 'gif', 'bmp', 'png', 'webp'],
            video: ['mpeg', 'mpg', 'mp4', 'amv', 'wmv', 'mov', 'avi', 'ogv', 'mkv', 'webm'],
            audio: ['mp3', 'wav', 'ogg', 'raw'],
            zip: ['zip', 'rar', '7z', 'gz'],
            txt: ['txt'],
            coffee: ['coffee'],
            git: ['gitignore', 'gitkeep'],
            xml: ['xml'],
            twig: ['twig'],
            c: ['c', 'h'],
            folder: ['folder'],
            'folder-active': ['folder-active'],
            kotlin: ['kt'],
            go: ['go']
        }

        this.icon = 'random'

        for(const iconKey in this.icons)
        {
            const iconExtensions = this.icons[ iconKey ]
            if(iconExtensions.indexOf(this.extension) !== -1)
            {
                this.icon = iconKey
            }
        }

        this.iconPath = require(`./icons/${this.icon}.svg`)
    }
}
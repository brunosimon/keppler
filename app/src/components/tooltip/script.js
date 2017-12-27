export default
{
    name: 'tooltip',

    props:
    {
        position: {
            type: String,
            default: 'top',
            validator(value)
            {
                return ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'].indexOf(value) !== -1
            }
        }
    }
}
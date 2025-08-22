import {useState, forwardRef, useImperativeHandle} from 'react'

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility
        }
    })

    const {showLabel, hideLabel, legend, children} = props

    return visible ?
        (
            <div>
                {legend} {legend ? ' ' : null}
                <button onClick={toggleVisibility}>{hideLabel}</button>
                <div>
                    {children}
                </div>
            </div>
        ) : (
            <div>
                {legend} {legend ? ' ' : null}
                <button onClick={toggleVisibility}>{showLabel}</button>
            </div>
        )
})

export default Togglable
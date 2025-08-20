const RenderOnCondition = ({condition, children}) => {

    return condition ? children : null;
}

export default RenderOnCondition
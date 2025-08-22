import Togglable from "./Togglable.jsx";

const Blog = ({blog}) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }
    return (<div style={blogStyle}>
        <Togglable showLabel='view' hideLabel='hide' legend={blog.title}>
            <div>
                <div> {blog.url}</div>
                <div>Likes: {blog.likes}
                    <button>like</button>
                </div>
                <div>{blog.author}</div>
            </div>
        </Togglable>
    </div>)
}

export default Blog
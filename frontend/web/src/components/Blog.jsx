import Togglable from "./Togglable.jsx";
import blogService from "../services/blogs.js";

const Blog = ({blog, onUpdate}) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleLike = async () => {
        try {
            const result = await blogService.like(blog)
            onUpdate(result)
        } catch (error) {
            console.log('blog:', blog)
            console.error('fail:', error)
        }
    }

    return (<div style={blogStyle}>
        <Togglable showLabel='view' hideLabel='hide' legend={blog.title}>
            <div>
                <div> {blog.url}</div>
                <div>Likes: {blog.likes}
                    <button onClick={handleLike}>like</button>
                </div>
                <div>{blog.author}</div>
            </div>
        </Togglable>
    </div>)
}

export default Blog
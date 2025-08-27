import Togglable from "./Togglable.jsx";
import blogService from "../services/blogs.js";

const Blog = ({blog, onUpdate, onRemove}) => {
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
            console.error('fail to add like:', error)
        }
    }

    const handleRemove = async () => {
        if (window.confirm(`remove blog ${blog.title} by ${blog.author}?`)) {
            try {
                await blogService.remove(blog.id)
                onRemove(blog.id)
            } catch (error) {
                console.error('fail to remove:', error)
            }
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
                <button onClick={handleRemove}>remove</button>
            </div>
        </Togglable>
    </div>)
}

export default Blog
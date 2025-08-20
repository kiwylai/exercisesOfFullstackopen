import {useState, useEffect, useRef} from "react";
import blogService from "../services/blogs.js";
import Blog from "./Blog.jsx";
import RenderOnCondition from "./RenderOnCondition.jsx";
import loginService from "../services/login.js";
import Togglable from "./Togglable.jsx";

const Blogs = ({emitError, emitSuccess}) => {
    const [blogs, setBlogs] = useState([])
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: ''
    })
    const blogFormRef = useRef()
    const loggedUser = loginService.getUser()

    useEffect(() => {
        blogService.getAll().then((initialblogs) => {
            setBlogs(initialblogs);
        });
    }, []);

    const addBlog = (event) => {
        event.preventDefault();

        const blogObject = {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url
        };

        blogFormRef.current.toggleVisibility()

        blogService.create(blogObject).then((returnedblog) => {
            setBlogs(blogs.concat(returnedblog));
            emitSuccess(`a new blog ${newBlog.title} by ${newBlog.author} was added`)
            setNewBlog({
                title: '',
                author: '',
                url: ''
            });
        })
            .catch((error) => {
                console.error('Error creating blog:', error);
                emitError('Failed to create blog');
            });
    };

    const handleBlogChange = (event) => {
        const {name, value} = event.target;
        setNewBlog({
            ...newBlog,
            [name]: value
        });
    }

    const blogForm = () => (
        <form onSubmit={addBlog}>
            <div>
                title:
                <input
                    type="text"
                    value={newBlog.title}
                    name="title"
                    onChange={handleBlogChange}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={newBlog.author}
                    name="author"
                    onChange={handleBlogChange}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={newBlog.url}
                    name="url"
                    onChange={handleBlogChange}
                />
            </div>

            <button type="submit">create</button>
        </form>
    )

    return (
        <div>
            <h1>Blogs</h1>
            <div>
                <RenderOnCondition condition={loggedUser}>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                        <h2>create new</h2>
                        {blogForm()}
                    </Togglable>
                </RenderOnCondition>
            </div>
            {blogs.map(blog =>
                <Blog key={blog.id}
                      blog={blog}
                />
            )}
        </div>
    )
}

export default Blogs
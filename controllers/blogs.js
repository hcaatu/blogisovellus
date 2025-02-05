const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({})
        .populate('user', {username: 1, name: 1})
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const body = req.body
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' })
    }

    user = req.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        user: user.id,
        url: body.url,
        likes: body.likes
    })

    if (!req.body.title || !req.body.url) {
        return res.status(400).json({
            error: 'missing title or url'
        })
    }
  
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    res.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' })
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    if (!req.body.title || !req.body.url) {
        return res.status(400).json({
            error: 'missing title or url'
        })
    }
    
    const newBlog = {
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes
    }
    
    updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, { new: true })
    console.log(updatedBlog)
    res.status(200).json(updatedBlog)
})

module.exports = blogsRouter
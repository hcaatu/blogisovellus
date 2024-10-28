const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)

    if (!req.body.title || !req.body.url) {
        return res.status(400).json({
            error: 'missing title or url'
        })
    }
  
    const result = await blog.save()
    res.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
    deltedBlog = await Blog.findByIdAndDelete(req.params.id)
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